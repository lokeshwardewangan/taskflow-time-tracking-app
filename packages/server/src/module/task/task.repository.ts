import { prisma } from '../../../prisma/config';
import type { Prisma } from '../../generated/prisma/client.ts';

export class TaskRepository {
   static async findAllTasksByUser(userId: string) {
      return prisma.task.findMany({
         where: { userId },
         orderBy: { createdAt: 'desc' },
      });
   }

   static async findTaskByIdAndUser(taskId: string, userId: string) {
      return prisma.task.findFirst({
         where: { id: taskId, userId },
      });
   }

   static async createTask(userId: string, data: Prisma.TaskUncheckedCreateInput) {
      return prisma.task.create({
         data: {
            ...data,
            userId,
         },
      });
   }

   static async updateTask(taskId: string, data: Prisma.TaskUpdateInput) {
      return prisma.task.update({
         where: { id: taskId },
         data,
      });
   }

   static async deleteTask(taskId: string, userId: string) {
      return prisma.task.deleteMany({
         where: { id: taskId, userId },
      });
   }
}
