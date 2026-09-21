import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { once } from 'node:events';
import type { Server } from 'node:http';
import authRoutes from './auth.route.js';
import { AuthService } from './auth.service.js';

vi.mock('../../config/env.js', () => ({
   env: { NODE_ENV: 'production', JWT_SECRET: 'test-auth-cookie-secret' },
}));
vi.mock('./auth.service.js', () => ({
   AuthService: { login: vi.fn(), register: vi.fn() },
}));
vi.mock('./auth.repository.js', () => ({
   AuthRepository: { findUserById: vi.fn().mockResolvedValue({ id: 'user-1' }) },
}));

describe('Production authentication cookies', () => {
   let server: Server;
   let base: string;

   beforeAll(async () => {
      const app = express();
      app.use(express.json(), cookieParser());
      app.use('/api/auth', authRoutes);
      server = app.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Missing test server address');
      base = `http://127.0.0.1:${address.port}/api/auth`;
   });

   afterAll(async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) =>
         server.close((error) => (error ? reject(error) : resolve()))
      );
   });

   it('sets cross-site cookie attributes and accepts the login token on /me', async () => {
      const user = { id: 'user-1', name: 'Test User', email: 'test@example.com' };
      const token = jwt.sign({ userId: user.id }, 'test-auth-cookie-secret', { expiresIn: '7d' });
      vi.mocked(AuthService.login).mockResolvedValue({ user, token });
      const login = await fetch(`${base}/login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: user.email, password: 'test-password' }),
      });
      expect(login.status).toBe(200);
      const cookie = login.headers.get('set-cookie')!;
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('Secure');
      expect(cookie).toContain('SameSite=None');
      expect(cookie).toContain('Path=/');
      await login.json();

      // Replay explicitly: Node fetch does not implement browser cookie storage/policy.
      const me = await fetch(`${base}/me`, { headers: { Cookie: cookie.split(';')[0]! } });
      expect(me.status).toBe(200);
      expect(await me.json()).toMatchObject({ data: { userId: user.id } });
   });

   it('still rejects requests without authentication', async () => {
      const response = await fetch(`${base}/me`);
      expect(response.status).toBe(401);
      expect(await response.json()).toMatchObject({ message: 'Not authorized, token missing' });
   });

   it('clears the cookie with matching production attributes', async () => {
      const response = await fetch(`${base}/logout`, { method: 'POST' });
      const cookie = response.headers.get('set-cookie')!;
      expect(response.status).toBe(200);
      expect(cookie).toContain('token=;');
      expect(cookie).toContain('Path=/');
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('Secure');
      expect(cookie).toContain('SameSite=None');
      expect(cookie).toContain('Expires=Thu, 01 Jan 1970');
      await response.json();
   });
});
