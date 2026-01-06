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

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface SignupResponse {
  message: string;
}

export const authService = {
  async signup(userData: SignupData): Promise<SignupResponse> {
    return apiClient.post<SignupResponse>('/auth/signup', userData);
  },

  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await apiClient.post<{ success: boolean; data: LoginResponse }>('/auth/login', credentials);
    // Backend wraps response in { success, data }, so unwrap it
    return response.data || response;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
  },

  async resetPasswordRequest(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/auth/reset-password-request', { email });
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

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>('/auth/refresh-token', { refreshToken });
  },
};
