import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { authorize } from '../middlewares/authorize.js';

const tasksRouter = Router();

tasksRouter.use(authorize);

tasksRouter.get('/:boardId/tasks', isValidId, ctrlWrapper());

// - column create /boards/board:id/columns post
// - column get /boards/board:id/column get
// - column delete /board/board:id/columns/column:id delete
// - column update /boards/board:id/columns/column:id update
