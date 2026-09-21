import type { Request, Response } from 'express';
import { TaskService } from './task.service.js';
import asyncHandler from '../../utils/async-handler.js';
import { createTaskSchema, updateTaskSchema, improveTaskSchema } from './task.schema.js';
import { TaskAIService } from './task-ai.service.js';
import { ApiResponse, HTTP } from '../../utils/response.js';

export const improveTask = asyncHandler(async (req: Request, res: Response) => {
   const input = improveTaskSchema.parse(req.body);
   const suggestion = await TaskAIService.improveTask(input);
   return res
      .status(HTTP.OK)
      .json(new ApiResponse(HTTP.OK, suggestion, 'Task suggestion generated'));
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore Set by auth middleware
   const userId = req.user.userId;
   const tasks = await TaskService.getTasks(userId);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, tasks, 'Tasks retrieved successfully'));
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const id = req.params.id as string;
   const task = await TaskService.getTaskById(id, userId);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, task, 'Task retrieved successfully'));
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const data = createTaskSchema.parse(req.body);
   const task = await TaskService.createTask(userId, data);
   return res
      .status(HTTP.CREATED)
      .json(new ApiResponse(HTTP.CREATED, task, 'Task created successfully'));
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const id = req.params.id as string;
   const data = updateTaskSchema.parse(req.body);
   const task = await TaskService.updateTask(id, userId, data);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, task, 'Task updated successfully'));
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
   // @ts-ignore
   const userId = req.user.userId;
   const id = req.params.id as string;
   await TaskService.deleteTask(id, userId);
   return res.status(HTTP.OK).json(new ApiResponse(HTTP.OK, null, 'Task deleted successfully'));
});
