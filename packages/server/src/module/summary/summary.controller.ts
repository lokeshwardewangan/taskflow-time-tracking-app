import type { Request, Response } from 'express';
import { SummaryService } from './summary.service';
import asyncHandler from '../../utils/async-handler';
import { ApiResponse, HTTP } from '../../utils/response';

export const getDailySummary = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const summary = await SummaryService.getDailySummary(userId);
   return res
      .status(HTTP.OK)
      .json(new ApiResponse(HTTP.OK, summary, 'Daily summary retrieved successfully'));
});
