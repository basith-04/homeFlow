import express from 'express';
import { getFilterLogs, createFilterLog, updateFilterLog } from '../controllers/filterLogsController.js';
import { authMiddleware } from '../middleware/auth.js';

export const filterLogsRouter = express.Router();

filterLogsRouter.use(authMiddleware);

filterLogsRouter.get('/', getFilterLogs);
filterLogsRouter.post('/', createFilterLog);
filterLogsRouter.patch('/:id', updateFilterLog);
