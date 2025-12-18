import { Timestamps } from '../common';

export type ID = string | number;

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
  recentActivity: Array<{
    id: string | number;
    action: string;
    device: string;
    location: string;
    timestamp: string;
    successful: boolean;
  }>;
}

export interface ActivityLog {
  id: ID;
  action: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  status: 'success' | 'failed';
  createdAt: string | Date;
  updatedAt: string | Date;
}

// For authentication context
export type AuthUser = Pick<User, 'id' | 'email' | 'role' | 'firstName' | 'lastName' | 'avatar'>;
