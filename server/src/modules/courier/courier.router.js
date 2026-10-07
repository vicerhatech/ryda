import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import {
  cancelCourier,
  createCourier,
  getCourierById,
  getMyCourierDeliveries
} from './courier.controller.js';

const courierRouter = Router();

courierRouter.use(requireAuth);
courierRouter.post('/', createCourier);
courierRouter.get('/my', getMyCourierDeliveries);
courierRouter.get('/:id', getCourierById);
courierRouter.patch('/:id/cancel', cancelCourier);

export default courierRouter;
