import dotenv from 'dotenv'
dotenv.config()
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/authRouter.js'



const app=express()
const PORT=8000
app.use(cors())
app.use(express.json())
app.use('/auth',authRouter)
app.listen(PORT,()=>console.log('server is running on the port',process.env.DB_NAME))