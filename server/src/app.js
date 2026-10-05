import cors from 'cors';
import express from 'express';
import { notFoundHandler, errorHandler } from './shared/middleware/errorMiddleware.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

// Feature routers are mounted here by their owners during the scheduled integration tasks.
// /api/auth, /api/rides, /api/courier, /api/driver, /api/payments and /api/admin

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
