export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            //return res.status(500).json({ message: "Internal server error", error:error.stack })
            return next(new Error("Internal server error"))
        })
    }
}

const globalErrorHandler = (err, req, res, next) => {
    if (err) {
        return res.json({ message: err.message })
    }
}
export default globalErrorHandler;