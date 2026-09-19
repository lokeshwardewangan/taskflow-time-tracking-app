import { TimeLogRepository } from '../time-log/time-log.repository';
import { TaskRepository } from '../task/task.repository';

export class SummaryService {
   static async getDailySummary(userId: string) {
      // Setup midnight bounds for today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch today's timelogs (includes linked tasks)
      const timeLogsToday = await TimeLogRepository.findLogsByDaily(userId, startOfDay, endOfDay);

      let totalTrackedTimeToday = 0;
      const tasksWorkedOnMap = new Map();

      timeLogsToday.forEach((log) => {
         // Accumulate duration (default to 0 if still running, or calculate elapsed)
         if (log.duration) {
            totalTrackedTimeToday += log.duration;
         } else if (!log.endTime) {
            // Live active timer contribution
            const liveDuration = Math.floor(
               (new Date().getTime() - log.startTime.getTime()) / 1000
            );
            totalTrackedTimeToday += liveDuration;
         }

         // Track Unique tasks worked on today
         if (!tasksWorkedOnMap.has(log.taskId)) {
            tasksWorkedOnMap.set(log.taskId, log.task);
         }
      });

      const tasksWorkedOnToday = Array.from(tasksWorkedOnMap.values());

      // Fetch all tasks to get global completion statistics
      const allTasks = await TaskRepository.findAllTasksByUser(userId);

      let globalCompleted = 0;
      let globalPending = 0;
      let globalInProgress = 0;
      let completedToday = 0;

      allTasks.forEach((task) => {
         if (task.status === 'COMPLETED') {
            globalCompleted++;

            // Check if it was completed today specifically (by checking updatedAt)
            if (task.updatedAt >= startOfDay && task.updatedAt <= endOfDay) {
               completedToday++;
            }
         } else if (task.status === 'PENDING') {
            globalPending++;
         } else if (task.status === 'IN_PROGRESS') {
            globalInProgress++;
         }
      });

      return {
         tasksWorkedOnToday,
         totalTrackedTimeTodaySeconds: totalTrackedTimeToday,
         todayCompletedTaskCount: completedToday,
         totalPendingTaskCount: globalPending,
         totalInProgressTaskCount: globalInProgress,
         totalCompletedTaskCount: globalCompleted,
      };
   }
}
