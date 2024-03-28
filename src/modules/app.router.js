import userRouter from './User/user.router.js'
import postRouter from './Post/post.router.js'
import authRouter from './Auth/auth.router.js'
import connectDB from '../../DB/connection.js'
import cors from 'cors'
import globalErrorHandler from '../middleware/errorHandling.js'


const initApp = (app, express) => {
    connectDB()
    app.use(cors())
    app.use(express.json())
    app.use('/user', userRouter)
    app.use('/post', postRouter)
    app.use('/auth', authRouter)

    app.use(globalErrorHandler)
    
    app.get('/', (req, res) => {
        return res.status(201).json("Welcome...")
    })
    app.get('*', (req, res) => {
        return res.json({ message: "Page not found 404 x_x" })
    })
}
export default initApp

