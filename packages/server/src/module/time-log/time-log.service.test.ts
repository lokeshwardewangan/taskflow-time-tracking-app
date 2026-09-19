import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimeLogService } from './time-log.service';
import { TimeLogRepository } from './time-log.repository';
import { TaskRepository } from '../task/task.repository';
import { ApiError } from '../../utils/response';

vi.mock('./time-log.repository', () => ({
   TimeLogRepository: {
      findActiveLog: vi.fn(),
      createLog: vi.fn(),
      stopLog: vi.fn(),
   },
}));

vi.mock('../task/task.repository', () => ({
   TaskRepository: {
      findTaskByIdAndUser: vi.fn(),
      updateTask: vi.fn(),
   },
}));

describe('TimeLogService', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   describe('startTimer (One-Timer Rule)', () => {
      it('should auto-stop an existing active timer on a DIFFERENT task before starting the requested one', async () => {
         const oldTimer = {
            id: 'log-old',
            taskId: 'old-task',
            startTime: new Date(Date.now() - 5000),
         }; // 5 sec ago

         // Mock that the new task exists and is currently PENDING
         vi.mocked(TaskRepository.findTaskByIdAndUser).mockResolvedValue({
            id: 'new-task',
            status: 'PENDING',
         } as any);

         // Mock that the frontend had left a different task running
         vi.mocked(TimeLogRepository.findActiveLog).mockResolvedValue(oldTimer as any);
         vi.mocked(TimeLogRepository.createLog).mockResolvedValue({ id: 'log-new' } as any);

         await TimeLogService.startTimer('new-task', 'user-123');

         // Should have explicitly stopped the old log
         expect(TimeLogRepository.stopLog).toHaveBeenCalledWith('log-old', expect.any(Number));

         // Should have updated the NEW task status to IN_PROGRESS
         expect(TaskRepository.updateTask).toHaveBeenCalledWith('new-task', {
            status: 'IN_PROGRESS',
         });

         // Should have created a new log for the new task
         expect(TimeLogRepository.createLog).toHaveBeenCalledWith('new-task', 'user-123');
      });

      it('should instantly return the active log identically if starting the SAME task that is already running', async () => {
         const sameTimer = { id: 'log-same', taskId: 'same-task' };

         // Mock task existing
         vi.mocked(TaskRepository.findTaskByIdAndUser).mockResolvedValue({
            id: 'same-task',
         } as any);
         // Same active task returned
         vi.mocked(TimeLogRepository.findActiveLog).mockResolvedValue(sameTimer as any);

         const result = await TimeLogService.startTimer('same-task', 'user-123');

         expect(result).toEqual(sameTimer);
         // Did not touch the DB for stopping or creating
         expect(TimeLogRepository.stopLog).not.toHaveBeenCalled();
         expect(TimeLogRepository.createLog).not.toHaveBeenCalled();
      });

      it('should throw NOT_FOUND ApiError if trying to start timer on a task they dont own', async () => {
         vi.mocked(TaskRepository.findTaskByIdAndUser).mockResolvedValue(null);

         const promise = TimeLogService.startTimer('missing-task', 'user-123');
         await expect(promise).rejects.toThrow(ApiError);
         await expect(promise).rejects.toMatchObject({ statusCode: 404 });
      });
   });

   describe('stopTimer', () => {
      it('should successfully stop the timer and calculate duration', async () => {
         const startTime = new Date(Date.now() - 10000); // 10 seconds ago
         const activeLog = { id: 'log-1', taskId: 'task-1', startTime };

         vi.mocked(TimeLogRepository.findActiveLog).mockResolvedValue(activeLog as any);
         vi.mocked(TimeLogRepository.stopLog).mockResolvedValue({
            id: 'log-1',
            duration: 10,
         } as any);

         const result = await TimeLogService.stopTimer('task-1', 'user-1');

         expect(TimeLogRepository.findActiveLog).toHaveBeenCalledWith('user-1');
         expect(TimeLogRepository.stopLog).toHaveBeenCalledWith('log-1', expect.any(Number));
         expect(result).toEqual({ id: 'log-1', duration: 10 });
      });

      it('should throw APIError if no active timer exists for this task', async () => {
         const activeLog = { id: 'log-1', taskId: 'different-task', startTime: new Date() };
         vi.mocked(TimeLogRepository.findActiveLog).mockResolvedValue(activeLog as any);

         const promise = TimeLogService.stopTimer('task-1', 'user-1');

         await expect(promise).rejects.toThrow(ApiError);
         await expect(promise).rejects.toMatchObject({
            statusCode: 400,
            message: 'No active timer found for this task',
         });
      });
   });
});
