import userModel from "../../../../DB/user.model.js"
import cloudinary from "../../../services/cloudinary.js"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export const getUsers = async(req, res, next) => {
    // Get all users in the database
    const users = await userModel.find({})
    return res.status(201).json({ message: "users", users })
}

export const profile = async (req, res, next) => {
    if (!req.file) {
        return next(new Error("Please provide a file"));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/user/${req.user._id}/profile`
    })
    const user = await userModel.findByIdAndUpdate(req.user._id, { profilePic: { secure_url, public_id } }, { new: false })

    if (user.profilePic) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
    }
    return res.json({ message: user })
}

// Function to encrypt data
function encrypt(text, key) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Function to decrypt data
function decrypt(encryptedText, key) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id);

    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
        return next(new Error('invalid old password'))
    }

    // Generate a key for encryption (you should store this securely)
    const encryptionKey = 'your_encryption_key_here';

    // Encrypt the new password
    const encryptedNewPassword = encrypt(newPassword, encryptionKey);

    const hashNewPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUND));
    await userModel.updateOne({ _id: req.user._id }, { password: hashNewPassword })

    // Decrypt the password for logging (optional)
    const decryptedPassword = decrypt(encryptedNewPassword, encryptionKey);
    console.log('Decrypted Password:', decryptedPassword);
    return res.json(user)
}

export const shareProfile = async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id).select("userName email")
    if (!user) {
        return next(new Error("User not found"));
    }
    return res.status(200).json({ message: "success", user })
}