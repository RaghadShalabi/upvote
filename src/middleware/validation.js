import joi from 'joi';
import { Types } from 'mongoose'
const dataMethods = ['body', 'query', 'headers', 'params', 'file']

const validationObjectId = (value, helper) => {
    if(Types.ObjectId.isValid(value)){
        return true;
    }
    return helper.message()
}

export const generalFields = {
    email: joi.string().email().required().messages({
        'string.empty': "email is required",
        'string.email': "plz enter a valid email",
        'string.base': "email must be string"
    }),
    password: joi.string().required().min(8).messages({
        'string.empty': "password is required",
        'string.min': "password length at least 6 characters long"
    }),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
        dest: joi.string(),
    }),
    id: joi.string().custom(validationObjectId).required()
}
export const validation = (Schema) => {
    return (req, res, next) => {
        const validationArray = []
        dataMethods.forEach((key) => {
            if (Schema[key]) {
                const validationResult = Schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationArray.push(validationResult.error.details)
                }
            }
        })
        if (validationArray.length > 0) {
            return res.status(422).json({ message: "Validation failed", details: validationArray })
        } else {
            return next()
        }
    }
}
