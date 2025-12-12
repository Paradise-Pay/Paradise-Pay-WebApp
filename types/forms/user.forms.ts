import { User } from '../domain/user';

export interface ProfileFormValues
  extends Omit<
    User,
    | 'id'
    | 'email'
    | 'emailVerified'
    | 'role'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'preferences'
    | 'notifications'
    | 'security'
  > {
  avatarFile?: File | null;
}

export interface NotificationSettingsFormValues {
  email: boolean;
  push: boolean;
  sms: boolean;
  eventReminders: boolean;
  ticketUpdates: boolean;
  paymentReceipts: boolean;
  marketing: boolean;
}

export interface SecuritySettingsFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
