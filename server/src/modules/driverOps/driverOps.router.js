import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireRole } from '../../shared/middleware/roleGuard.js';
import {
  getDriverDashboard,
  getDriverRequests,
  updateDriverAvailability
} from './driverOps.controller.js';

const driverOpsRouter = Router();

driverOpsRouter.use(requireAuth, requireRole('DRIVER'));
driverOpsRouter.patch('/availability', updateDriverAvailability);
driverOpsRouter.get('/dashboard', getDriverDashboard);
driverOpsRouter.get('/requests', getDriverRequests);

export default driverOpsRouter;
