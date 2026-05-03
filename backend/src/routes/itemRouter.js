import express from 'express';
import { createItem, getItems } from '../controllers/itemController.js';
import { authMiddleware } from '../middleware/auth.js';

export const itemRouter = express.Router();
itemRouter.use(authMiddleware)
itemRouter.post('/', createItem);
itemRouter.get('/', getItems);  