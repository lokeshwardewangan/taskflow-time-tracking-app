import type { Request, Response } from 'express';
import { TimeLogService } from './time-log.service';
import asyncHandler from '../../utils/async-handler';
import { ApiResponse, HTTP } from '../../utils/response';

export const getActiveTimer = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const activeLog = await TimeLogService.getActiveTimer(userId);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, activeLog, 'Active timer retrieved'));
});

export const startTimer = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const taskId = req.params.taskId as string;
   const log = await TimeLogService.startTimer(taskId, userId);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, log, 'Timer started successfully'));
});

export const stopTimer = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const taskId = req.params.taskId as string;
   const log = await TimeLogService.stopTimer(taskId, userId);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, log, 'Timer stopped successfully'));
});
