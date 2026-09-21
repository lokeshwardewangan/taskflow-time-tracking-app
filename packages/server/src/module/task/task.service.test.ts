import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskService } from './task.service.js';
import { TaskRepository } from './task.repository.js';
import { ApiError } from '../../utils/response.js';

// Mock the repository completely
vi.mock('./task.repository.js', () => ({
   TaskRepository: {
      findTaskByIdAndUser: vi.fn(),
      findAllTasksByUser: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
   },
}));

describe('TaskService', () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   describe('getTaskById (User Isolation)', () => {
      it('should return the task successfully if the logged-in user owns it', async () => {
         const mockTask = { id: 'task-123', title: 'Test Task', userId: 'user-xyz' };

         // Simulate DB finding the task for this specific user
         vi.mocked(TaskRepository.findTaskByIdAndUser).mockResolvedValue(mockTask as any);

         const task = await TaskService.getTaskById('task-123', 'user-xyz');

         expect(task).toEqual(mockTask);
         expect(TaskRepository.findTaskByIdAndUser).toHaveBeenCalledWith('task-123', 'user-xyz');
      });

      it('should throw a NOT_FOUND ApiError if another user attempts to access the task', async () => {
         // Simulate DB returning null because the task belongs to someone else
         vi.mocked(TaskRepository.findTaskByIdAndUser).mockResolvedValue(null);

         const intruderCall = TaskService.getTaskById('task-123', 'intruder-user');

         await expect(intruderCall).rejects.toThrow(ApiError);
         await expect(intruderCall).rejects.toMatchObject({ statusCode: 404 });
         expect(TaskRepository.findTaskByIdAndUser).toHaveBeenCalledWith(
            'task-123',
            'intruder-user'
         );
      });
   });
});
