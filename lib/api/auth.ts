import { apiClient } from './client';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  nickname: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

interface VerifyEmailResponse {
  message: string;
  success: boolean;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface SignupResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  message: string;
  success: boolean;
}

export const authService = {
  async signup(userData: SignupData): Promise<SignupResponse> {
    return apiClient.post<SignupResponse>('/auth/signup', userData);
  },

  async login(credentials: LoginData): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    return apiClient.post<ResetPasswordResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return apiClient.get<VerifyEmailResponse>(`/auth/verify-email?token=${token}`);
  },
};
