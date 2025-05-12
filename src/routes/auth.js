import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { googleAuth, googleRedirect } from '../controller/auth.js';

const router = Router();

router.get('/google', ctrlWrapper(googleAuth));

router.get('/google-redirect', ctrlWrapper(googleRedirect));

export default router;
