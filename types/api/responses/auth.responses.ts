import { User } from '../../domain/user';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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
