import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { LoginRequest, LoginResponse } from '../../types/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post<{ success: boolean; data: LoginResponse }>(
        '/auth/login',
        credentials
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('companyId', data.companyId);
      localStorage.setItem('role', data.role);
    },
  });
};
