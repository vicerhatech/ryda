import { Router } from 'express';

import { requireAuth } from '../../../shared/middleware/authMiddleware.js';
import { requireRole } from '../../../shared/middleware/roleGuard.js';
import {
  cancelRide,
  createRide,
  getMyRides,
  getRide
} from '../controllers/rideRequestController.js';
import { createRideReview } from '../controllers/rideReviewController.js';

const rideRequestRouter = Router();

rideRequestRouter.post('/', requireAuth, requireRole('RIDER'), createRide);
rideRequestRouter.get('/my', requireAuth, requireRole('RIDER'), getMyRides);
rideRequestRouter.post('/:id/review', requireAuth, requireRole('RIDER'), createRideReview);
rideRequestRouter.get('/:id', requireAuth, requireRole('RIDER'), getRide);
rideRequestRouter.patch('/:id/cancel', requireAuth, requireRole('RIDER'), cancelRide);

export default rideRequestRouter;
