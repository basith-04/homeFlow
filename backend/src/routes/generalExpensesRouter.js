import express from 'express'
import { createExpense, deleteExpense, getExpenseCategories, getExpenses, updateExpense } from '../controllers/generalExpensesController.js'
import { authMiddleware } from '../middleware/auth.js'
import { attachHouseholdId } from '../middleware/household.js'
export const generalExpensesRouter=express.Router()
generalExpensesRouter.use(authMiddleware)
generalExpensesRouter.use(attachHouseholdId)
generalExpensesRouter.get('/',getExpenses)
generalExpensesRouter.get('/categories',getExpenseCategories)
generalExpensesRouter.post('/',createExpense)
generalExpensesRouter.put('/:id', updateExpense)
generalExpensesRouter.delete('/:id',deleteExpense)
