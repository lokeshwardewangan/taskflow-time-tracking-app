import { TaskRepository } from './task.repository';
import type { CreateTaskInput, UpdateTaskInput } from './task.schema';
import { ApiError, HTTP } from '../../utils/response';

export class TaskService {
   static async getTasks(userId: string) {
      return TaskRepository.findAllTasksByUser(userId);
   }

   static async getTaskById(taskId: string, userId: string) {
      const task = await TaskRepository.findTaskByIdAndUser(taskId, userId);
      if (!task) {
         throw new ApiError(HTTP.NOT_FOUND, 'Task not found or unauthorized');
      }
      return task;
   }

   static async createTask(userId: string, input: CreateTaskInput) {
      return TaskRepository.createTask(userId, {
         title: input.title,
         description: input.description,
         status: input.status,
         userId,
      });
   }

   static async updateTask(taskId: string, userId: string, input: UpdateTaskInput) {
      // First ensure the task exists and belongs to the user
      const existingTask = await TaskRepository.findTaskByIdAndUser(taskId, userId);
      if (!existingTask) {
         throw new ApiError(HTTP.NOT_FOUND, 'Task not found or unauthorized');
      }

      // We explicitly pass the ID to update avoiding Prisma unique constrain error
      await TaskRepository.updateTask(taskId, input);
      return TaskRepository.findTaskByIdAndUser(taskId, userId);
   }

   static async deleteTask(taskId: string, userId: string) {
      const result = await TaskRepository.deleteTask(taskId, userId);
      if (result.count === 0) {
         throw new ApiError(HTTP.NOT_FOUND, 'Task not found or unauthorized');
      }
      return { success: true };
   }
}
