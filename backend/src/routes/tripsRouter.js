import express from 'express';
import { createTrip, getTrips, getTripById, deleteTrip, updateTrip, addExpenseToTrip, updateExpenseInTrip, removeExpenseFromTrip } from '../controllers/tripsController.js';
import {attachHouseholdId} from '../middleware/household.js'
import { authMiddleware } from '../middleware/auth.js';
export const tripsRouter = express.Router();

tripsRouter.use(authMiddleware)
tripsRouter.use(attachHouseholdId)

tripsRouter.post('/',createTrip)
tripsRouter.get('/',getTrips)
tripsRouter.get('/:id',getTripById)
tripsRouter.delete('/:id',deleteTrip)
tripsRouter.put('/:id',updateTrip)
tripsRouter.post('/:id/expenses',addExpenseToTrip)
tripsRouter.put('/:id/expenses/:expenseId',updateExpenseInTrip)
tripsRouter.delete('/:tripId/expenses/:expenseId',removeExpenseFromTrip)