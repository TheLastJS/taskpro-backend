import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createUserSchema, updateUserSchema } from '../validators/user.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updatePatchUserController,
} from '../controller/user.js';
import { upload } from '../middlewares/upload.js';

// Starts with '/users' endpoint
const usersRouter = Router();

//Get Users
usersRouter.get('/', ctrlWrapper(getUsersController));

//Get User by ID
usersRouter.get('/:userId', isValidId, ctrlWrapper(getUserByIdController));

//Create User
usersRouter.post(
  '/',
  upload.single('avatar'),
  validateBody(createUserSchema),
  ctrlWrapper(createUserController),
);
//Update User
usersRouter.patch(
  '/:userId',
  isValidId,
  validateBody(updateUserSchema),
  ctrlWrapper(updatePatchUserController),
);
//Delete User
usersRouter.delete('/:userId', isValidId, ctrlWrapper(deleteUserController));

export default usersRouter;
