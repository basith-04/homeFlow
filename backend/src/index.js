import dotenv from 'dotenv'
dotenv.config()
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/authRouter.js'
import { householdRouter } from './routes/householdRouter.js'
import { itemRouter } from './routes/itemRouter.js'
import { groceryPurchasesRouter } from './routes/groceryPurchasesRouter.js'


const app=express()
const PORT=process.env.PORT || 8080
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('server is running')
})
app.use('/auth',authRouter)
app.use('/household',householdRouter)
app.use('/items',itemRouter)
app.use('/grocery-purchases',groceryPurchasesRouter)
app.listen(PORT, "0.0.0.0", () => {
  console.log("server is running on the port", PORT);
});