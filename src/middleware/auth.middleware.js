import jwt from 'jsonwebtoken'
import userModel from '../../DB/user.model.js'
import { asyncHandler } from './errorHandling.js'

export const auth = asyncHandler(
    async (req, res, next) => {
        const { authorization } = req.headers
        if (!authorization?.startsWith(process.env.BEARER_TOKEN)) {
            return res.status(400).json({ message: "Invalid authorization" })
        }
        const token = authorization.split(process.env.BEARER_TOKEN)[1]
        if (!token) {
            return res.status(400).json({ message: "Invalid token" })
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        const authUser = await userModel.findById(decodedToken.id).select("userName email")
        if (!authUser) {
            return res.status(400).json({ message: "not register account" })
        }
        req.user = authUser;
        next()
    }
) 