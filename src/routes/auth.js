import { Router } from 'express';
import validateBody from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validators/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  refreshUserController,
  getGoogleAuthUrlController,
} from '../controller/auth.js';

const authRouter = Router();

//  Starts with '/auth' endpoint

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.get('/google', ctrlWrapper(getGoogleAuthUrlController));
export default authRouter;
