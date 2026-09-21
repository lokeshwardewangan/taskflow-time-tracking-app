import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError, ApiResponse, HTTP } from '../utils/response.js';

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
   if (res.headersSent) return next(error);
   if (error instanceof ZodError) {
      res.status(HTTP.BAD_REQUEST).json(
         new ApiResponse(HTTP.BAD_REQUEST, null, 'Invalid request data')
      );
      return;
   }
   if (error instanceof ApiError) {
      res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      return;
   }
   if (error instanceof SyntaxError && 'type' in error && error.type === 'entity.parse.failed') {
      res.status(HTTP.BAD_REQUEST).json(
         new ApiResponse(HTTP.BAD_REQUEST, null, 'Invalid JSON body')
      );
      return;
   }
   res.status(HTTP.INTERNAL_SERVER_ERROR).json(
      new ApiResponse(HTTP.INTERNAL_SERVER_ERROR, null, 'Internal server error')
   );
};
