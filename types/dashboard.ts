export interface DashboardStats {
  upcomingEvents: number;
  activeTickets: number;
  walletBalance: number;
  totalEventsAttended?: number;
  totalTicketsPurchased?: number;
  recentActivity?: Activity[];
}

export interface Activity {
  id: string;
  type: 'event_created' | 'ticket_purchased' | 'event_attended' | 'payment_received' | 'profile_updated';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
  color?: string;
}

export interface DashboardQuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

export interface UserProfile {
  id: string;
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
  role: string;
  preferences: UserPreferences;
  notifications: UserNotifications;
  security: UserSecurity;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
}

export interface UserNotifications {
  email: boolean;
  push: boolean;
  sms: boolean;
  eventReminders: boolean;
  ticketUpdates: boolean;
  paymentReceipts: boolean;
  marketing: boolean;
}

export interface UserSecurity {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  deviceManagement: boolean;
  recentActivity: SecurityActivity[];
}

export interface SecurityActivity {
  id: string;
  action: string;
  device: string;
  location: string;
  timestamp: string;
  successful: boolean;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  preferences?: Partial<UserPreferences>;
  notifications?: Partial<UserNotifications>;
  security?: Partial<UserSecurity>;
}

export interface ProfileUpdateResponse {
  success: boolean;
  data?: UserProfile;
  message?: string;
}