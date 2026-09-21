import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './module/auth/auth.route.js';
import taskRoutes from './module/task/task.route.js';
import timeLogRoutes from './module/time-log/time-log.route.js';
import summaryRoutes from './module/summary/summary.route.js';
import { errorHandler } from './middleware/error.middleware.js';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      origin: env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
   })
);

app.get('/health', (_req: Request, res: Response) => {
   try {
      res.status(200).json({
         status: 'ok',
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      res.status(500).json({
         status: 'error',
         message: 'Internal server error',
      });
   }
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time-logs', timeLogRoutes);
app.use('/api/summary', summaryRoutes);
app.use(errorHandler);

export default app;
