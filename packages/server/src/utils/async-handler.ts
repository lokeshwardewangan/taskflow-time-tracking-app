import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown;

const asyncHandler =
   (requestHandler: AsyncHandler): RequestHandler =>
   (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch(next);
   };

export default asyncHandler;
