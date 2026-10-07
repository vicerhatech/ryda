import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireRole } from '../../shared/middleware/roleGuard.js';
import {
  acceptCourier,
  cancelCourier,
  createCourier,
  getCourierById,
  getMyCourierDeliveries,
  updateCourierStatus
} from './courier.controller.js';

const courierRouter = Router();

courierRouter.use(requireAuth);
courierRouter.post('/', createCourier);
courierRouter.get('/my', getMyCourierDeliveries);
courierRouter.get('/:id', getCourierById);
courierRouter.patch('/:id/cancel', cancelCourier);
courierRouter.post('/:id/accept', requireRole('DRIVER'), acceptCourier);
courierRouter.patch('/:id/status', requireRole('DRIVER'), updateCourierStatus);

export default courierRouter;
