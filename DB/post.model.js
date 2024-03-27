import mongoose, { Schema, model, Types } from 'mongoose'

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    image: {
        type: Object,
        required: true,
    },
    userId: {
        type: Types.ObjectId, ref: 'User',
        required: true,
    },
    like: [{ type: Types.ObjectId, ref: 'User' }],
    unLike: [{ type: Types.ObjectId, ref: 'User' }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    totalVote: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
})

const postModel = model('Post', postSchema)

export default postModel;