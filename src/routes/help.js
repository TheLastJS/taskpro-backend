import { Router } from 'express';
import { helpController } from '../controller/help.js';
import validateBody from '../middlewares/validateBody.js';
import { needHelpSchema } from '../validators/help.js';

const router = Router();

router.post(
  '/help',
  validateBody(needHelpSchema),
  helpController.sendNeedHelpEmail,
);

export const helpRouter = router;
