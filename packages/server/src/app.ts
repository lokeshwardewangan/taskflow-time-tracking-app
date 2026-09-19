import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './module/auth/auth.route';
import taskRoutes from './module/task/task.route';
import timeLogRoutes from './module/time-log/time-log.route';
import summaryRoutes from './module/summary/summary.route';

const app = express();
app.use(express.json());
app.use(cookieParser());

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

export default app;
