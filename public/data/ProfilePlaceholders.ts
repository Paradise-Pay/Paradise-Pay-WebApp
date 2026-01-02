export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Event Manager' | 'Finance Admin';
  bio: string;
  avatarUrl?: string; // Optional URL
  location: string;
  joinedDate: string;
  twoFactorEnabled: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
}

export const mockProfile: UserProfile = {
  id: 'u-123',
  firstName: 'Kweku',
  lastName: 'Admin',
  email: 'kweku.admin@paradisepay.com',
  phone: '+233 54 123 4567',
  role: 'Super Admin',
  bio: 'Senior administrator overseeing platform operations and organizer relationships.',
  location: 'Accra, Ghana',
  joinedDate: 'January 15, 2025',
  twoFactorEnabled: true,
  notifications: {
    email: true,
    sms: false,
    marketing: false,
  }
};