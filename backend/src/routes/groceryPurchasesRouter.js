import express from 'express'
import  { createGroceryPurchase, getGroceryPurchases,removeGroceryPurchase ,updateGroceryPurchase } from '../controllers/groceryPurchasesController.js'
import { authMiddleware } from '../middleware/auth.js'
import { attachHouseholdId } from '../middleware/household.js'

export const groceryPurchasesRouter=express.Router()
groceryPurchasesRouter.use(authMiddleware)
groceryPurchasesRouter.use(attachHouseholdId)
groceryPurchasesRouter.post('/',createGroceryPurchase)
groceryPurchasesRouter.get('/',getGroceryPurchases)
groceryPurchasesRouter.put('/:id', updateGroceryPurchase)
groceryPurchasesRouter.delete('/:id', removeGroceryPurchase)