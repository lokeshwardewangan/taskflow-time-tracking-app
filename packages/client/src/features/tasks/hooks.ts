import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   getTasks,
   createTask,
   updateTask,
   deleteTask,
   getTaskTimeLogs,
   startTaskTimer,
   stopTaskTimer,
   improveTask,
} from './api';
import type { TimeLog } from './api';
import type { ApiResponse } from '@/types/api';
import type {
   Task,
   CreateTaskInput,
   UpdateTaskInput,
   ImproveTaskInput,
   TaskSuggestion,
} from './types';

export const useImproveTask = () => {
   return useMutation<ApiResponse<TaskSuggestion>, Error, ImproveTaskInput>({
      mutationFn: improveTask,
      retry: false,
   });
};

export const useTasks = () => {
   return useQuery<ApiResponse<Task[]>, Error>({
      queryKey: ['tasks'],
      queryFn: getTasks,
   });
};

export const useCreateTask = () => {
   const queryClient = useQueryClient();
   return useMutation<ApiResponse<Task>, Error, CreateTaskInput>({
      mutationFn: createTask,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
   });
};

export const useUpdateTask = () => {
   const queryClient = useQueryClient();
   return useMutation<ApiResponse<Task>, Error, { id: string; payload: UpdateTaskInput }>({
      mutationFn: updateTask,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
   });
};

export const useDeleteTask = () => {
   const queryClient = useQueryClient();
   return useMutation<ApiResponse<null>, Error, string>({
      mutationFn: deleteTask,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
   });
};

export const useTaskTimeLogs = (taskId: string, enabled: boolean = true) => {
   return useQuery<ApiResponse<TimeLog[]>, Error>({
      queryKey: ['taskTimeLogs', taskId],
      queryFn: () => getTaskTimeLogs(taskId),
      enabled,
   });
};

export const useStartTaskTimer = () => {
   const queryClient = useQueryClient();
   return useMutation<ApiResponse<TimeLog>, Error, string>({
      mutationFn: startTaskTimer,
      onSuccess: (_data, taskId) => {
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
         queryClient.invalidateQueries({ queryKey: ['taskTimeLogs', taskId] });
      },
   });
};

export const useStopTaskTimer = () => {
   const queryClient = useQueryClient();
   return useMutation<ApiResponse<TimeLog>, Error, string>({
      mutationFn: stopTaskTimer,
      onSuccess: (_data, taskId) => {
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
         queryClient.invalidateQueries({ queryKey: ['taskTimeLogs', taskId] });
      },
   });
};
