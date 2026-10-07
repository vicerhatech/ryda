import { Router } from 'express';

import { requireAuth } from '../../../shared/middleware/authMiddleware.js';
import { requireRole } from '../../../shared/middleware/roleGuard.js';
import { acceptRide, updateRideStatus } from '../controllers/rideOperationsController.js';

const rideOperationsRouter = Router();

rideOperationsRouter.post('/:id/accept', requireAuth, requireRole('DRIVER'), acceptRide);
rideOperationsRouter.patch('/:id/status', requireAuth, requireRole('DRIVER'), updateRideStatus);

export default rideOperationsRouter;
