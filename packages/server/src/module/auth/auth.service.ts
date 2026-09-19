import { prisma } from '../../../prisma/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import type { RegisterInput, LoginInput } from './auth.schema';
import { ApiError, HTTP } from '../../utils/response';

export class AuthService {
   static async register(data: RegisterInput) {
      const existingUser = await prisma.user.findUnique({
         where: { email: data.email },
      });

      if (existingUser) {
         throw new ApiError(HTTP.CONFLICT, 'User already exists');
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
         data: {
            email: data.email,
            passwordHash,
         },
         select: {
            id: true,
            email: true,
            createdAt: true,
         },
      });

      return user;
   }

   static async login(data: LoginInput) {
      const user = await prisma.user.findUnique({
         where: { email: data.email },
      });

      if (!user) {
         throw new ApiError(HTTP.UNAUTHORIZED, 'Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

      if (!isPasswordValid) {
         throw new ApiError(HTTP.UNAUTHORIZED, 'Invalid credentials');
      }

      const token = jwt.sign(
         { userId: user.id, email: user.email },
         env.JWT_SECRET || 'fallback_secret',
         { expiresIn: '7d' }
      );

      return {
         user: {
            id: user.id,
            email: user.email,
         },
         token,
      };
   }
}
