import cors from 'cors';
import express from 'express';
import { notFoundHandler, errorHandler } from './shared/middleware/errorMiddleware.js';
import paymentRoutes from './modules/payments/paymentRoutes.js';
import liabilityRoutes from './modules/payments/liabilityRoutes.js';
import adminRoutes from './modules/admin/adminRoutes.js';
import { identityRouter } from './modules/identity/index.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api', identityRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/driver', liabilityRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
