import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { once } from 'node:events';
import type { Server } from 'node:http';
import taskRoutes from './task.route.js';
import { TaskRepository } from './task.repository.js';
import { AuthRepository } from '../auth/auth.repository.js';
import { errorHandler } from '../../middleware/error.middleware.js';

vi.mock('../../config/env.js', () => ({ env: { JWT_SECRET: 'test-task-secret' } }));
vi.mock('./task.repository.js', () => ({ TaskRepository: { createTask: vi.fn() } }));
vi.mock('../auth/auth.repository.js', () => ({ AuthRepository: { findUserById: vi.fn() } }));

describe('POST /api/tasks', () => {
   let server: Server;
   let url: string;
   const input = {
      title: 'Practical Redis Exercises and Documentation Review',
      description:
         'Complete practical exercises with Redis while studying the official documentation and supplementary YouTube videos that provide clear explanations.',
   };

   beforeAll(async () => {
      const app = express();
      app.use(express.json(), cookieParser());
      app.use('/api/tasks', taskRoutes);
      app.use(errorHandler);
      server = app.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Missing test address');
      url = `http://127.0.0.1:${address.port}/api/tasks`;
   });

   afterAll(async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) =>
         server.close((error) => (error ? reject(error) : resolve()))
      );
   });

   beforeEach(() => {
      vi.resetAllMocks();
      vi.mocked(AuthRepository.findUserById).mockResolvedValue({ id: 'user-1' });
      vi.mocked(TaskRepository.createTask).mockResolvedValue({
         id: 'task-1',
         ...input,
         userId: 'user-1',
         status: 'PENDING',
      } as any);
   });

   async function request(payload: object = { userId: 'user-1' }, cookie = false) {
      const token = jwt.sign(payload, 'test-task-secret', { expiresIn: '1m' });
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { Cookie: `token=${token}` } : { Authorization: `Bearer ${token}` }),
         },
         body: JSON.stringify(input),
      });
      return { status: response.status, body: await response.json() };
   }

   it.each([false, true])(
      'creates the reported task with an existing account (cookie=%s)',
      async (cookie) => {
         const response = await request({ userId: 'user-1' }, cookie);
         expect(response.status).toBe(201);
         expect(response.body).toMatchObject({ data: { ...input, status: 'PENDING' } });
         expect(TaskRepository.createTask).toHaveBeenCalledWith('user-1', {
            ...input,
            status: 'PENDING',
            userId: 'user-1',
         });
      }
   );

   it('rejects a stale session before attempting a foreign-key-invalid insert', async () => {
      vi.mocked(AuthRepository.findUserById).mockResolvedValue(null);
      expect((await request()).status).toBe(401);
      expect(TaskRepository.createTask).not.toHaveBeenCalled();
   });

   it.each([{}, { userId: 123 }, { userId: '' }])(
      'rejects invalid identity claims: %j',
      async (payload) => {
         expect((await request(payload)).status).toBe(401);
         expect(AuthRepository.findUserById).not.toHaveBeenCalled();
         expect(TaskRepository.createTask).not.toHaveBeenCalled();
      }
   );

   it('keeps database failures distinct from invalid sessions', async () => {
      vi.mocked(AuthRepository.findUserById).mockRejectedValue(new Error('Database unavailable'));
      const response = await request();
      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ message: 'Internal server error' });
      expect(TaskRepository.createTask).not.toHaveBeenCalled();
   });
});
