import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiResponse, HTTP } from '../utils/response.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
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

   try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      // @ts-ignore
      req.user = decoded;
      next();
   } catch (error) {
      return res
         .status(HTTP.UNAUTHORIZED)
         .json(new ApiResponse(HTTP.UNAUTHORIZED, null, 'Not authorized, token failed'));
   }
};
