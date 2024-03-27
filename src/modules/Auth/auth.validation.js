import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUpSchema =
{
    body: joi.object({
        userName: joi.string().required().messages({
            'string.empty': "userName is required",
            'string.base': "userName must be string"
        }),
        email: generalFields.email,
        password: generalFields.password,
        cPassword: joi.string().valid(joi.ref('password')).required().messages({
            'any.only': "confirm password and password not matched",
            'any.required': "Confirm Password is required"
        }),
    })
}

export const signInSchema =
{
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password,
    })
}