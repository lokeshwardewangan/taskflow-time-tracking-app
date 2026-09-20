import { useQuery } from '@tanstack/react-query';
import { getDailySummary } from './api';
import type { ApiResponse } from '@/types/api';
import type { DashboardSummary } from './api';

export const useDailySummary = () => {
   return useQuery<ApiResponse<DashboardSummary>, Error>({
      queryKey: ['dailySummary'],
      queryFn: getDailySummary,
   });
};
