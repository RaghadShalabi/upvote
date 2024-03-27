import Router from 'express'
const router = Router()
import * as userController from "./controller/user.controller.js"
import { auth } from '../../middleware/auth.middleware.js'
import { asyncHandler } from '../../middleware/errorHandling.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import { validation } from '../../middleware/validation.js'
import * as validators from './user.validation.js'

router.get('/allUsers', auth, userController.getUsers)
router.patch('/profile', fileUpload(fileValidation.image).single('image'), auth, validation(validators.profile), asyncHandler(userController.profile))
router.patch('/updatePassword', auth, validation(validators.updatePassword), asyncHandler(userController.updatePassword))
router.get('/:id/profile', validation(validators.shareProfile), asyncHandler(userController.shareProfile))
export default router;