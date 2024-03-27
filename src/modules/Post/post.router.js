import Router from 'express'
const router = Router()
import * as postController from "./controller/post.controller.js"
import * as commentController from ".//controller/comment.controller.js";
import fileUpload, { fileValidation } from '../../services/multer.js';
import { asyncHandler } from '../../middleware/errorHandling.js';
import { auth } from '../../middleware/auth.middleware.js';

router.post('/', fileUpload(fileValidation.image).single('image'), auth, asyncHandler(postController.createPost))
router.patch('/:id/like', auth, asyncHandler(postController.likePost))
router.patch('/:id/unLike', auth, asyncHandler(postController.unLikePost))
router.post('/:id/addComment', fileUpload(fileValidation.image).single('image'), auth, asyncHandler(commentController.addComment))
router.get('/allPosts', auth, asyncHandler(postController.getPosts))

export default router;