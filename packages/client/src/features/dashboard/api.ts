import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { Task } from '@/features/tasks/types';

export interface DashboardSummary {
   tasksWorkedOnToday: Task[];
   totalTrackedTimeTodaySeconds: number;
   todayCompletedTaskCount: number;
   totalPendingTaskCount: number;
   totalInProgressTaskCount: number;
   totalCompletedTaskCount: number;
}

export const getDailySummary = async (): Promise<ApiResponse<DashboardSummary>> => {
   const { data } = await api.get<ApiResponse<DashboardSummary>>('/summary/daily');
   return data;
};
