import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { addBoardSchema, updateBoardSchema } from '../validators/board.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import { authorize } from '../middlewares/authorize.js';
import {
  getBoardController,
  createBoardController,
  updateBoardController,
  deleteBoardController,
  updateBoardBackground,
  getBoardsController,
  addColumnToBoardController,
  getColumnsController,
  deleteColumnController,
  updateColumnController,
  getTasksController,
  addTaskToColumnController,
  updateTaskController,
  deleteTaskController,
} from '../controller/board.js';
import { addColumnSchema } from '../validators/column.js';
import { addTaskSchema, updateTaskSchema } from '../validators/task.js';

// Starts with '/boards' endpoint
const boardsRouter = Router();

// Middleware to check if the user is authorized
boardsRouter.use(authorize);

// Get Board by ID
boardsRouter.get('/:boardId', isValidId, ctrlWrapper(getBoardController));

// Create Board
boardsRouter.post(
  '/',
  validateBody(addBoardSchema),
  ctrlWrapper(createBoardController),
);

// Update Board
boardsRouter.patch(
  '/:boardId',
  isValidId,
  validateBody(updateBoardSchema),
  ctrlWrapper(updateBoardController),
);

// Update Board Background
boardsRouter.patch(
  '/:boardId/background',
  isValidId,
  ctrlWrapper(updateBoardBackground),
);

// Delete Board
boardsRouter.delete('/:boardId', isValidId, ctrlWrapper(deleteBoardController));

// Get all boards for the user
boardsRouter.get('/', ctrlWrapper(getBoardsController));

// Get Columns of a Board
boardsRouter.get(
  '/:boardId/columns',
  isValidId,
  ctrlWrapper(getColumnsController),
);
// Add Column to Board
boardsRouter.post(
  '/:boardId/columns',
  isValidId,
  validateBody(addColumnSchema), // bunu birazdan oluşturacağız
  ctrlWrapper(addColumnToBoardController),
);

// Update Column
boardsRouter.patch(
  '/:boardId/columns/:columnId',
  isValidId,
  validateBody(addColumnSchema),
  ctrlWrapper(updateColumnController),
);

// Delete Column from Board
boardsRouter.delete(
  '/:boardId/columns/:columnId',
  isValidId,
  ctrlWrapper(deleteColumnController),
);

//post task to column
boardsRouter.post(
  '/:boardId/columns/:columnId/task',
  isValidId,
  validateBody(addTaskSchema),
  ctrlWrapper(addTaskToColumnController),
);

//get task from column
boardsRouter.get(
  '/:boardId/columns/:columnId/task',
  isValidId,
  ctrlWrapper(getTasksController),
);

//update task from column
boardsRouter.patch(
  '/:boardId/columns/:columnId/task/:taskId',
  isValidId,
  validateBody(updateTaskSchema),
  ctrlWrapper(updateTaskController),
);

//delete task from column
boardsRouter.delete(
  '/:boardId/columns/:columnId/task/:taskId',
  isValidId,
  ctrlWrapper(deleteTaskController),
);

export default boardsRouter;
