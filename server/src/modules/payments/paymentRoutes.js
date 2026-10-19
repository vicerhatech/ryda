import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { initializePayment, listPaymentHistory, verifyPayment } from './controllers/paymentController.js';

const router = Router();

router.use(requireAuth);
router.post('/initialize', initializePayment);
router.get('/verify/:reference', verifyPayment);
router.get('/history', listPaymentHistory);

export default router;
