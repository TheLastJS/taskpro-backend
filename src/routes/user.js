import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createUserSchema, updateUserSchema } from '../validators/user.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createUserController,
  deleteUserController,
  getCurrentUserController,
  getUserByIdController,
  getUsersController,
  updatePatchUserController,
} from '../controller/user.js';
import { upload } from '../middlewares/upload.js';
import { authorize } from '../middlewares/authorize.js';

// Starts with '/users' endpoint
const usersRouter = Router();
// Middleware to check if the user is authorized
usersRouter.use(authorize);

//Get Users
usersRouter.get('/', ctrlWrapper(getUsersController));

// Get Current User
usersRouter.get('/current', ctrlWrapper(getCurrentUserController));

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
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updatePatchUserController),
);
//Delete User
usersRouter.delete('/:userId', isValidId, ctrlWrapper(deleteUserController));

export default usersRouter;
