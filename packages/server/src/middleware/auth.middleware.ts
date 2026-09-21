import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiResponse, HTTP } from '../utils/response.js';
import { AuthRepository } from '../module/auth/auth.repository.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
   let token = req.cookies?.token;

   if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
         token = authHeader.split(' ')[1];
      }
   }

   if (!token) {
      return res
         .status(HTTP.UNAUTHORIZED)
         .json(new ApiResponse(HTTP.UNAUTHORIZED, null, 'Not authorized, token missing'));
   }

   let decoded: jwt.JwtPayload;
   try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      if (
         typeof payload === 'string' ||
         typeof payload.userId !== 'string' ||
         !payload.userId.trim()
      ) {
         throw new Error('Invalid user ID');
      }
      decoded = payload;
   } catch (error) {
      return res
         .status(HTTP.UNAUTHORIZED)
         .json(new ApiResponse(HTTP.UNAUTHORIZED, null, 'Not authorized, token failed'));
   }

   try {
      const user = await AuthRepository.findUserById(decoded.userId);
      if (!user) {
         return res
            .status(HTTP.UNAUTHORIZED)
            .json(
               new ApiResponse(
                  HTTP.UNAUTHORIZED,
                  null,
                  'Your account no longer exists. Please sign in again.'
               )
            );
      }
   } catch (error) {
      return next(error);
   }

   // @ts-ignore Set for downstream authenticated controllers.
   req.user = decoded;
   next();
};
