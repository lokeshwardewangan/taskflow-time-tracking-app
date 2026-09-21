import { TimeLogRepository } from './time-log.repository.js';
import { TaskRepository } from '../task/task.repository.js';
import { ApiError, HTTP } from '../../utils/response.js';

export class TimeLogService {
   static async getActiveTimer(userId: string) {
      return TimeLogRepository.findActiveLog(userId);
   }

   static async startTimer(taskId: string, userId: string) {
      // 1. Verify task belongs to user
      const task = await TaskRepository.findTaskByIdAndUser(taskId, userId);
      if (!task) {
         throw new ApiError(HTTP.NOT_FOUND, 'Task not found');
      }

      // 2. Check for an already active timer across any task
      const activeLog = await TimeLogRepository.findActiveLog(userId);
      if (activeLog) {
         if (activeLog.taskId === taskId) {
            // It's already running on the SAME task, return it
            return activeLog;
         }
         // Auto-stop the currently running timer on a different task
         const duration = Math.floor((new Date().getTime() - activeLog.startTime.getTime()) / 1000);
         await TimeLogRepository.stopLog(activeLog.id, duration);
      }

      // 3. Mark the target task as IN_PROGRESS if it was PENDING
      if (task.status === 'PENDING') {
         await TaskRepository.updateTask(taskId, { status: 'IN_PROGRESS' });
      }

      // 4. Start the new timer
      return TimeLogRepository.createLog(taskId, userId);
   }

   static async stopTimer(taskId: string, userId: string) {
      // Find the active timer specifically for this task and user
      const activeLog = await TimeLogRepository.findActiveLog(userId);

      if (!activeLog || activeLog.taskId !== taskId) {
         throw new ApiError(HTTP.BAD_REQUEST, 'No active timer found for this task');
      }

      const duration = Math.floor((new Date().getTime() - activeLog.startTime.getTime()) / 1000);

      return TimeLogRepository.stopLog(activeLog.id, duration);
   }

   static async getLogsByTask(taskId: string, userId: string) {
      const task = await TaskRepository.findTaskByIdAndUser(taskId, userId);
      if (!task) {
         throw new ApiError(HTTP.NOT_FOUND, 'Task not found');
      }
      return TimeLogRepository.findLogsByTask(taskId, userId);
   }
}
