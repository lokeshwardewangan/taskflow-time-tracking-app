import { AuthRepository } from './auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';
import { ApiError, HTTP } from '../../utils/response.js';

export class AuthService {
   static async register(data: RegisterInput) {
      const existingUser = await AuthRepository.findUserByEmail(data.email);

      if (existingUser) {
         throw new ApiError(HTTP.CONFLICT, 'User already exists');
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const user = await AuthRepository.createUser(data.name, data.email, passwordHash);

      return user;
   }

   static async login(data: LoginInput) {
      const user = await AuthRepository.findUserByEmail(data.email);

      if (!user) {
         throw new ApiError(HTTP.UNAUTHORIZED, 'Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

      if (!isPasswordValid) {
         throw new ApiError(HTTP.UNAUTHORIZED, 'Invalid credentials');
      }

      const token = jwt.sign(
         { userId: user.id, name: user.name, email: user.email },
         env.JWT_SECRET || 'fallback_secret',
         { expiresIn: '7d' }
      );

      return {
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
         },
         token,
      };
   }
}
