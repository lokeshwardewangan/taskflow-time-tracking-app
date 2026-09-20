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
      const taskDailyDurationMap = new Map<string, number>();

      timeLogsToday.forEach((log) => {
         let durationForLog = 0;
         // Accumulate duration (default to 0 if still running, or calculate elapsed)
         if (log.duration) {
            durationForLog = log.duration;
         } else if (!log.endTime) {
            // Live active timer contribution
            durationForLog = Math.floor((new Date().getTime() - log.startTime.getTime()) / 1000);
         }

         totalTrackedTimeToday += durationForLog;
         taskDailyDurationMap.set(
            log.taskId,
            (taskDailyDurationMap.get(log.taskId) || 0) + durationForLog
         );

         // Track Unique tasks worked on today
         if (!tasksWorkedOnMap.has(log.taskId)) {
            tasksWorkedOnMap.set(log.taskId, log.task);
         }
      });

      // Override the physical DB's lifetime trackedTime with just TODAY's accumulated time for the dashboard context
      const tasksWorkedOnToday = Array.from(tasksWorkedOnMap.values()).map((task) => ({
         ...task,
         trackedTime: taskDailyDurationMap.get(task.id) || 0,
      }));

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
