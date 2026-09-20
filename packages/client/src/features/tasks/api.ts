import api from '@/lib/api';
import type { Task, CreateTaskInput, UpdateTaskInput } from './types';
import type { ApiResponse } from '@/types/api';

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
   const { data } = await api.get<ApiResponse<Task[]>>('/tasks');
   return data;
};

export const createTask = async (payload: CreateTaskInput): Promise<ApiResponse<Task>> => {
   const { data } = await api.post<ApiResponse<Task>>('/tasks', payload);
   return data;
};

export const updateTask = async (params: {
   id: string;
   payload: UpdateTaskInput;
}): Promise<ApiResponse<Task>> => {
   const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${params.id}`, params.payload);
   return data;
};

export const deleteTask = async (id: string): Promise<ApiResponse<null>> => {
   const { data } = await api.delete<ApiResponse<null>>(`/tasks/${id}`);
   return data;
};

export const getTaskTimeLogs = async (taskId: string): Promise<ApiResponse<any>> => {
   const { data } = await api.get<ApiResponse<any>>(`/time-logs/task/${taskId}`);
   return data;
};

export const startTaskTimer = async (taskId: string): Promise<ApiResponse<any>> => {
   const { data } = await api.post<ApiResponse<any>>(`/time-logs/task/${taskId}/start`);
   return data;
};

export const stopTaskTimer = async (taskId: string): Promise<ApiResponse<any>> => {
   const { data } = await api.post<ApiResponse<any>>(`/time-logs/task/${taskId}/stop`);
   return data;
};
