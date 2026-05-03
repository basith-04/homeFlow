import express from 'express'
import  { createGroceryPurchase, getGroceryPurchases } from '../controllers/groceryPurchasesController.js'
import { authMiddleware } from '../middleware/auth.js'

export const groceryPurchasesRouter=express.Router()
groceryPurchasesRouter.use(authMiddleware)
groceryPurchasesRouter.post('/',createGroceryPurchase)
groceryPurchasesRouter.get('/',getGroceryPurchases)