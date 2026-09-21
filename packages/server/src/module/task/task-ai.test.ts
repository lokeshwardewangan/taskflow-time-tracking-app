import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import { once } from 'node:events';
import type { Server } from 'node:http';
import taskRoutes from './task.route.js';
import { errorHandler } from '../../middleware/error.middleware.js';
import { env } from '../../config/env.js';

const { parse, options } = vi.hoisted(() => ({ parse: vi.fn(), options: vi.fn() }));
vi.mock('openai', async (importOriginal) => {
   const actual = await importOriginal<typeof import('openai')>();
   return {
      ...actual,
      default: class extends actual.default {
         constructor(config: ConstructorParameters<typeof actual.default>[0]) {
            super(config);
            options(config);
            this.responses.parse = parse;
         }
      },
   };
});
vi.mock('../../config/env.js', () => ({
   env: { JWT_SECRET: 'test-task-ai-secret', AI_ENABLED: true, OPENAI_API_KEY: 'test-key' },
}));
vi.mock('./task.repository.js', () => ({ TaskRepository: {} }));
vi.mock('../auth/auth.repository.js', () => ({
   AuthRepository: { findUserById: vi.fn().mockResolvedValue({ id: 'user-1' }) },
}));

describe('POST /api/tasks/improve', () => {
   let server: Server;
   let url: string;
   const suggestion = {
      title: 'Fix login validation',
      description: 'Fix validation in the login form.',
   };
   const token = jwt.sign({ userId: 'user-1' }, 'test-task-ai-secret');

   beforeAll(async () => {
      const app = express();
      app.use(express.json(), cookieParser());
      app.use('/api/tasks', taskRoutes);
      app.use(errorHandler);
      server = app.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Missing test address');
      url = `http://127.0.0.1:${address.port}/api/tasks/improve`;
   });

   afterAll(async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) => {
         server.close((error) => (error ? reject(error) : resolve()));
      });
   });

   beforeEach(() => {
      parse.mockReset();
      env.AI_ENABLED = true;
      env.OPENAI_API_KEY = 'test-key';
      parse.mockResolvedValue({ status: 'completed', output: [], output_parsed: suggestion });
   });

   async function request(body: unknown, authenticated = true) {
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...(authenticated ? { Cookie: `token=${token}` } : {}),
         },
         body: JSON.stringify(body),
      });
      return { status: response.status, body: await response.json() };
   }

   it('requires authentication before calling the provider', async () => {
      expect((await request({ title: 'Fix login' }, false)).status).toBe(401);
      expect(parse).not.toHaveBeenCalled();
   });

   it.each([
      {},
      { title: '  ', description: '\n' },
      { title: 123 },
      { title: 'a'.repeat(201) },
      { description: 'a'.repeat(4001) },
      { title: 'Task', model: 'another-model' },
      { title: 'Task', description: null },
   ])('rejects invalid input without a provider call: %j', async (input) => {
      const result = await request(input);
      expect(result.status).toBe(400);
      expect(result.body).toMatchObject({ success: false });
      expect(parse).not.toHaveBeenCalled();
   });

   it('returns a suggestion with bounded provider options and normalized draft text', async () => {
      const result = await request({ title: '  fix login  ' });
      expect(result).toEqual({
         status: 200,
         body: {
            statusCode: 200,
            data: suggestion,
            message: 'Task suggestion generated',
            success: true,
         },
      });
      expect(parse).toHaveBeenCalledWith(
         expect.objectContaining({
            model: 'gpt-4.1-mini',
            store: false,
            max_output_tokens: 1500,
            input: JSON.stringify({ title: 'fix login', description: '' }),
            text: { format: expect.objectContaining({ type: 'json_schema', strict: true }) },
         })
      );
      expect(options).toHaveBeenCalledWith(
         expect.objectContaining({ timeout: 15000, maxRetries: 0 })
      );
   });

   it('accepts a description-only draft', async () => {
      expect((await request({ description: 'Fix login validation' })).status).toBe(200);
   });

   it.each(['disabled', 'missing key'])('returns 503 when AI is %s', async (condition) => {
      if (condition === 'disabled') env.AI_ENABLED = false;
      else env.OPENAI_API_KEY = '';
      expect((await request({ title: 'Fix login' })).status).toBe(503);
      expect(parse).not.toHaveBeenCalled();
   });

   it.each([
      { status: 'incomplete', output: [], output_parsed: suggestion },
      { status: 'completed', output: [], output_parsed: null },
      { status: 'completed', output: [], output_parsed: { title: ' ', description: 'Task' } },
      {
         status: 'completed',
         output: [],
         output_parsed: { title: 'a'.repeat(201), description: 'Task' },
      },
   ])('rejects unusable provider output', async (response) => {
      parse.mockResolvedValue(response);
      expect((await request({ title: 'Fix login' })).status).toBe(502);
   });

   it('handles a refusal without exposing provider text', async () => {
      parse.mockResolvedValue({
         status: 'completed',
         output_parsed: null,
         output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'private content' }] }],
      });
      const result = await request({ title: 'Fix login' });
      expect(result.status).toBe(422);
      expect(JSON.stringify(result.body)).not.toContain('private content');
   });

   it('maps timeouts to 504', async () => {
      parse.mockRejectedValue(new OpenAI.APIConnectionTimeoutError());
      expect((await request({ title: 'Fix login' })).status).toBe(504);
   });

   it('maps provider quota errors to 503', async () => {
      parse.mockRejectedValue(new OpenAI.APIError(429, undefined, 'quota', new Headers()));
      expect((await request({ title: 'Fix login' })).status).toBe(503);
   });

   it('sanitizes unexpected provider failures', async () => {
      parse.mockRejectedValue(new Error('secret provider details'));
      const result = await request({ title: 'Fix login' });
      expect(result.status).toBe(502);
      expect(JSON.stringify(result.body)).not.toContain('secret provider details');
   });
});
