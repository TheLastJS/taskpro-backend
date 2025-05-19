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
} from '../controller/board.js';

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

export default boardsRouter;
