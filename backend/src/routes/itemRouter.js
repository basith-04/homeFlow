import express from 'express';
import { createItem, getItems } from '../controllers/itemController.js';

export const itemRouter = express.Router();

itemRouter.post('/', createItem);
itemRouter.get('/', getItems);  