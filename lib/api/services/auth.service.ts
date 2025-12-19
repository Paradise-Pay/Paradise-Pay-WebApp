import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { RegisterRequest } from '../../../types/api/requests/auth.requests';
import { AuthResponse } from '../../../types/api/responses/auth.responses';
import { LoginRequest } from '../../../types/api/requests/auth.requests';

export const authService = {
  signUp: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  // Helper function to set auth tokens in localStorage
  setAuth: (tokens: { accessToken: string; refreshToken: string }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  },

  // Helper function to clear auth tokens
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },

  // Get current user from token
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload.user || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
};
