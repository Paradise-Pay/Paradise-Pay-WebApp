import { Timestamps, ID } from '../common';

export type UserRole = 'admin' | 'organizer' | 'user';

export interface User extends Timestamps {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  timezone: string;
  emailVerified: boolean;
  role: UserRole;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  eventReminders: boolean;
  ticketUpdates: boolean;
  paymentReceipts: boolean;
  marketing: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  deviceManagement: boolean;
  recentActivity: ActivityLog[];
}

export interface ActivityLog extends Timestamps {
  id: ID;
  action: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  status: 'success' | 'failed';
}

// For authentication context
export interface AuthUser extends Pick<User, 'id' | 'email' | 'role' | 'firstName' | 'lastName' | 'avatar'> {
  // Add any auth-specific fields here
}
