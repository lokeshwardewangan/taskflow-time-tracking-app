import { prisma } from '../../../prisma/config.js';

export class TimeLogRepository {
   static async findActiveLog(userId: string) {
      return prisma.timeLog.findFirst({
         where: { userId, endTime: null },
      });
   }

   static async createLog(taskId: string, userId: string) {
      return prisma.timeLog.create({
         data: {
            taskId,
            userId,
            startTime: new Date(),
         },
      });
   }

   static async stopLog(logId: string, durationInSeconds: number) {
      return prisma.timeLog.update({
         where: { id: logId },
         data: {
            endTime: new Date(),
            duration: durationInSeconds,
         },
      });
   }

   static async findLogsByDaily(userId: string, startOfDay: Date, endOfDay: Date) {
      return prisma.timeLog.findMany({
         where: {
            userId,
            startTime: { gte: startOfDay, lte: endOfDay },
         },
         include: { task: true },
      });
   }

   static async findLogsByTask(taskId: string, userId: string) {
      return prisma.timeLog.findMany({
         where: { taskId, userId },
         orderBy: { startTime: 'desc' },
      });
   }
}
