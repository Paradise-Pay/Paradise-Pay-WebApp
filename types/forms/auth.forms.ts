export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailFormValues {
  token: string;
}
