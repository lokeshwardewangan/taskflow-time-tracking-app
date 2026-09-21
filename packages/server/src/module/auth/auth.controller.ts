import type { CookieOptions, Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import asyncHandler from '../../utils/async-handler.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { ApiResponse, HTTP } from '../../utils/response.js';
import { env } from '../../config/env.js';

const authCookieOptions: CookieOptions = {
   httpOnly: true,
   secure: env.NODE_ENV === 'production',
   sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
   path: '/',
};

export const register = asyncHandler(async (req: Request, res: Response) => {
   const data = registerSchema.parse(req.body);
   const user = await AuthService.register(data);
   return res
      .status(HTTP.CREATED)
      .json(new ApiResponse(HTTP.CREATED, user, 'User registered successfully'));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
   const data = loginSchema.parse(req.body);
   const result = await AuthService.login(data);

   res.cookie('token', result.token, authCookieOptions);

   return res
      .status(HTTP.OK)
      .json(new ApiResponse(HTTP.OK, { user: result.user }, 'Login successful'));
});

export const me = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore - set by auth middleware
   const user = req.user;
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, user, 'User profile retrieved'));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
   res.clearCookie('token', authCookieOptions);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, null, 'Logged out successfully'));
});
