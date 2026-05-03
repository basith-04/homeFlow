import express from 'express'
import { createHousehold, getHousehold } from '../controllers/householdController.js'
import { authMiddleware } from '../middleware/auth.js'
export const householdRouter=express.Router()

householdRouter.use(authMiddleware)
householdRouter.post('/',createHousehold)
householdRouter.get('/',getHousehold)