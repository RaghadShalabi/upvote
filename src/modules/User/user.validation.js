import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const profile =
{
    file: generalFields.file.required(),
}

export const updatePassword = {
    body: joi.object({
        oldPassword: generalFields.password,
        newPassword: generalFields.password.invalid(joi.ref("oldPassword")).messages({
            "any.invalid": "New password must be different with the Old Password",
        }),
        cNewPassword: joi.string().valid(joi.ref('newPassword')).required().messages({
            'any.only': "confirm password and new password not matched",
            'any.required': "Confirm Password is required"
        })
    })
}

export const shareProfile = {
    params : joi.object({
        id : generalFields.id,
    })
}
