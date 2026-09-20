import { useMutation, useQuery } from '@tanstack/react-query';
import { getUser, loginUser, registerUser } from './api';
import type { ApiResponse } from '@/types/api';
import type { LoginInput, RegisterInput, User } from './types';

export const useRegisterUser = () => {
   return useMutation<ApiResponse<User>, Error, RegisterInput>({
      mutationFn: registerUser,
   });
};

export const useLoginUser = () => {
   return useMutation<ApiResponse<User>, Error, LoginInput>({
      mutationFn: loginUser,
   });
};

export const useUser = () => {
   return useQuery<ApiResponse<User>, Error>({
      queryKey: ['user'],
      queryFn: getUser,
   });
};
