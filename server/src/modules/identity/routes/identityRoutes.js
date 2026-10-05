import { Router } from 'express';
import { getCurrentUser, login, register } from '../controllers/authController.js';
import { requireAuth } from '../../../shared/middleware/authMiddleware.js';

const identityRouter = Router();

identityRouter.post('/auth/register', register);
identityRouter.post('/auth/login', login);
identityRouter.get('/auth/me', requireAuth, getCurrentUser);

export default identityRouter;
