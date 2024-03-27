import commentModel from "../../../../DB/comment.model.js";
import postModel from "../../../../DB/post.model.js";
import cloudinary from "../../../services/cloudinary.js";

export const createPost = async (req, res, next) => {
    if (!req.file) {
        return next(new Error("Please provide a file"));
    }
    const { title, caption } = req.body;
    const id = req.user._id;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/post/${req.user._id}`
    })
    const post = await postModel.create({ title, caption, image: { secure_url, public_id }, userId: id })
    return res.status(201).json(post);
}

export const likePost = async (req, res, next) => {
    const { id } = req.params
    const user_id = req.user._id
    const post = await postModel.findByIdAndUpdate(id, { $addToSet: { like: user_id }, $pull: { unLike: user_id } }, { new: true });

    post.totalVote = post.like.length - post.unLike.length;
    await post.save();
    return res.status(201).json({ message: "success", post })
}

export const unLikePost = async (req, res, next) => {
    const { id } = req.params
    const user_id = req.user._id
    const post = await postModel.findByIdAndUpdate(id, { $addToSet: { unLike: user_id }, $pull: { like: user_id } }, { new: true });

    post.totalVote = post.like.length - post.unLike.length;
    await post.save();
    return res.status(201).json({ message: "success", post })
}

export const getPosts = async (req, res, next) => {
    const posts = await postModel.find({}).populate([
        {
            path: 'userId',
            select: 'userName'
        },
        {
            path: 'like',
            select: 'userName'
        },
        {
            path: 'unLike',
            select: 'userName'
        }
    ])
    const postList = [];
    for (const post of posts) {
        const comment = await commentModel.find({ postId: post._id })
        postList.push({ post, comment })
    }
    return res.status(201).json({ message: "success", postList })
}