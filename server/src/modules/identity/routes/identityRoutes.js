import { Router } from 'express';
import { getCurrentUser, login, register, updateProfile } from '../controllers/authController.js';
import { getMyVerification, submitVerification } from '../controllers/driverVerificationController.js';
import { requireAuth } from '../../../shared/middleware/authMiddleware.js';
import { requireRole } from '../../../shared/middleware/roleGuard.js';

const identityRouter = Router();

identityRouter.post('/auth/register', register);
identityRouter.post('/auth/login', login);
identityRouter.get('/auth/me', requireAuth, getCurrentUser);
identityRouter.patch('/profile', requireAuth, updateProfile);
identityRouter.post('/driver-verification', requireAuth, requireRole('DRIVER'), submitVerification);
identityRouter.get('/driver-verification/me', requireAuth, requireRole('DRIVER'), getMyVerification);

export default identityRouter;
