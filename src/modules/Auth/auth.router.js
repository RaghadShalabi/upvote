import Router from 'express'
const router = Router()
import * as authController from "./controller/auth.controller.js"
import { asyncHandler } from '../../middleware/errorHandling.js'
import { validation } from '../../middleware/validation.js'
import { signInSchema, signUpSchema } from './auth.validation.js'

router.post('/signUp', validation(signUpSchema), asyncHandler(authController.signUp))
router.post('/signIn', validation(signInSchema), asyncHandler(authController.signIn))
router.put('/confirmEmail/:emailToken', asyncHandler(authController.confirmEmail))
router.put('/newConfirmEmail/:refreshToken', asyncHandler(authController.newConfirmEmail))

export default router;