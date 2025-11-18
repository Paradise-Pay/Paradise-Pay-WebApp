export type UserRole = 'admin' | 'organizer' | 'user';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
}

export interface UserProfile {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  notifications: NotificationSettings;
  security: SecuritySettings;
  preferences: UserPreferences;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  notifications?: Partial<NotificationSettings>;
  security?: Partial<SecuritySettings>;
  preferences?: Partial<UserPreferences>;
}

// For form validation and UI state
export interface UserProfileFormData extends Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'role'> {}

// For authentication context
export interface AuthUser extends Pick<UserProfile, 'id' | 'email' | 'role' | 'firstName' | 'lastName' | 'avatar'> {
  // Add any auth-specific fields here
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateUserProfileDto) => Promise<void>;
  refreshUser: () => Promise<void>;
}
