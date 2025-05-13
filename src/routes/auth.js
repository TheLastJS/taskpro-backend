import { Router } from 'express';
import validateBody from '../middlewares/validatorBody.js';
import { createUserSchema, loginUserSchema } from '../validators/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getGoogleAuthUrlController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();

//  Starts with '/auth' endpoint

authRouter.post(
  '/register',
  validateBody(createUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/logout', ctrlWrapper(logoutUserController));

authRouter.post('/refresh', ctrlWrapper(refreshUserController));

authRouter.post(
  '/request-reset-email',
  ctrlWrapper(requestResetEmailController),
);

authRouter.post('/reset-password', ctrlWrapper(resetPasswordController));

authRouter.get('/google', ctrlWrapper(getGoogleAuthUrlController));

export default authRouter;
