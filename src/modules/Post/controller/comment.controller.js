import postModel from "../../../../DB/post.model.js";
import commentModel from "../../../../DB/comment.model.js";
import cloudinary from "../../../services/cloudinary.js";

export const addComment = async (req, res, next) => {
    req.body.postId = req.params.id;
    req.body.userId = req.user._id;
    const post = await postModel.findById(req.params.id);
    if (!post) {
        return next(new Error("Post not found"));
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "comment" });
        req.body.image = { secure_url, public_id };
    }
    const comment = await commentModel.create(req.body);
    return res.status(201).json({ message: "success", comment })
}