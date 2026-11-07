import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/authMiddleware.js';
import { requireRole } from '../../shared/middleware/roleGuard.js';
import { listDriverLiabilities, settleDriverLiability } from './controllers/liabilityController.js';
import { createWithdrawal, getDriverWallet, listWithdrawals } from './controllers/walletController.js';

const router = Router();

router.use(requireAuth, requireRole('DRIVER'));
router.get('/liabilities', listDriverLiabilities);
router.post('/liabilities/settle', settleDriverLiability);
router.get('/wallet', getDriverWallet);
router.post('/withdrawals', createWithdrawal);
router.get('/withdrawals', listWithdrawals);

export default router;
