import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import type { ApiResponse } from '@/types/api';
import type { Task, CreateTaskInput, UpdateTaskInput } from './types';

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
