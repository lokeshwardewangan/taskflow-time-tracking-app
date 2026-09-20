import api from '@/lib/api';
import type { LoginInput, RegisterInput, User } from './types';
import type { ApiResponse } from '@/types/api';

export const registerUser = async (payload: RegisterInput): Promise<ApiResponse<User>> => {
   const { data } = await api.post<ApiResponse<User>>('/auth/register', payload);
   return data;
};

export const loginUser = async (payload: LoginInput): Promise<ApiResponse<User>> => {
   const { data } = await api.post<ApiResponse<User>>('/auth/login', payload);
   return data;
};

export const getUser = async (): Promise<ApiResponse<User>> => {
   const { data } = await api.get<ApiResponse<User>>('/auth/me');
   return data;
};
