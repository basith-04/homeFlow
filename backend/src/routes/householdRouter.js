import express from 'express'
import { createHousehold, getHousehold } from '../controllers/householdController.js'
export const householdRouter=express.Router()

householdRouter.post('/',createHousehold)
householdRouter.get('/',getHousehold)