import dotenv from 'dotenv';
dotenv.config();
import express from "express";
const app = express()
import initApp from "./src/modules/app.router.js";
const PORT = process.env.PORT || 3003;
initApp(app, express);


app.listen(PORT, () => {
    console.log(`server is running, on port ${PORT}`)
})


