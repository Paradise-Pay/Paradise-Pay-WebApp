import { User } from '../../domain/user';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface UserResponse {
  user: User;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  statusCode: number;
  validationErrors?: Record<string, string[]>;
}

export interface ValidationErrorResponse extends ErrorResponse {
  validationErrors: Record<string, string[]>;
}
