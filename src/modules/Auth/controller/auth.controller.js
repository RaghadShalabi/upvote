import userModel from "../../../../DB/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../../services/sendEmail.js"

export const signUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (user) {
        return next(new Error("email exists"))
    }
    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND))
    const createUser = await userModel.create({ userName, email, password: hashedPassword })
    const emailToken = jwt.sign({ email }, process.env.SECRET_KEY_EMAIL, { expiresIn: '1h' })
    const refreshToken = jwt.sign({ email }, process.env.SECRET_KEY_EMAIL, { expiresIn: 60 * 60 * 24 })
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${emailToken}`
    const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`
    const html = `<h2>to confirm your email click a link <a href = ${link}> verify email </a> <br/> <br />
    or to request new email to confirm your email click a link <a href = ${refreshLink}>request new email</a></h2 >`
    sendEmail(email, "verify email", html)
    return res.status(201).json({ message: "success", createUser })
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("invalid email"))
    }
    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
        return next(new Error("invalid password"))
    }
    if (!user.confirmEmail) {
        return next(new Error("Please Confirm Your Email First!"))
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
    return res.status(201).json({ message: "sign in success", token });
}

export const confirmEmail = async (req, res, next) => {
    const { emailToken } = req.params
    const decodedEmailToken = jwt.verify(emailToken, process.env.SECRET_KEY_EMAIL)
    const updateUser = await userModel.findOneAndUpdate({ email: decodedEmailToken.email, confirmEmail: false }, { confirmEmail: true })
    if (!updateUser) {
        return next(new Error("your email is verified"))
    } else {
        return res.redirect(`${req.protocol}://${req.headers.host}/auth/signIn`)
    }
}

export const newConfirmEmail = async (req, res, next) => {
    const { refreshToken } = req.params
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.SECRET_KEY_EMAIL)
    const newEmailToken = jwt.sign({ email: decodedRefreshToken.email }, process.env.SECRET_KEY_EMAIL, { expiresIn: '1h' })
    const newLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newEmailToken}`
    const newHtml = `<h2>to confirm your email click a link <a href = ${newLink}>new verify email</a></h2>`
    sendEmail(decodedRefreshToken.email, "new verify email", newHtml)
    return res.status(201).json({ message: "new email is sent successfully, plz check your mail" })
}
