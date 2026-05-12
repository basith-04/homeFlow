import express from 'express'
import { createExpense, getExpenses } from '../controllers/generalExpensesController.js'
import { authMiddleware } from '../middleware/auth.js'
import { attachHouseholdId } from '../middleware/household.js'
export const generalExpensesRouter=express.Router()
generalExpensesRouter.use(authMiddleware)
generalExpensesRouter.use(attachHouseholdId)
generalExpensesRouter.get('/',getExpenses)
generalExpensesRouter.post('/',createExpense)