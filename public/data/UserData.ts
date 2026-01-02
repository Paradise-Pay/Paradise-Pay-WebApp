export type UserTier = 'Free' | 'Paradise+' | 'Paradise X';
export type UserRole = 'Customer' | 'Organizer';
export type AccountStatus = 'Active' | 'Suspended' | 'Pending'; // 'Pending' for new organizers

export interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: UserRole;
  tier: UserTier;
  status: AccountStatus;
  kycStatus: 'Verified' | 'Pending' | 'Rejected' | 'Unsubmitted';
  ticketsPurchased: number;
  bundlesRedeemed: number;
  walletBalance: number; // For "Issue Credit" feature
  organizationName?: string; // Only for Organizers
}

export const mockUsers: User[] = [
  // Customers
  { 
    id: '1', name: 'Kwame Mensah', email: 'kwame@example.com', contact: '+233 54 123 4567',
    role: 'Customer', tier: 'Paradise X', status: 'Active', kycStatus: 'Verified',
    ticketsPurchased: 12, bundlesRedeemed: 3, walletBalance: 250
  },
  { 
    id: '2', name: 'Ama Osei', email: 'ama.o@example.com', contact: '+233 20 987 6543',
    role: 'Customer', tier: 'Free', status: 'Active', kycStatus: 'Pending',
    ticketsPurchased: 2, bundlesRedeemed: 0, walletBalance: 0
  },
  { 
    id: '3', name: 'Kojo Antwi', email: 'kojo@test.com', contact: '+233 55 555 5555',
    role: 'Customer', tier: 'Paradise+', status: 'Suspended', kycStatus: 'Verified',
    ticketsPurchased: 8, bundlesRedeemed: 1, walletBalance: 120
  },
  // Organizers
  { 
    id: 'org-1', name: 'John Doe', email: 'john@events.com', contact: '+233 24 000 0000',
    role: 'Organizer', tier: 'Free', status: 'Pending', kycStatus: 'Pending',
    ticketsPurchased: 0, bundlesRedeemed: 0, walletBalance: 0, organizationName: 'AfroFuture Events'
  },
  { 
    id: 'org-2', name: 'Sarah Smith', email: 'sarah@ticketgh.com', contact: '+233 27 111 2222',
    role: 'Organizer', tier: 'Free', status: 'Active', kycStatus: 'Verified',
    ticketsPurchased: 0, bundlesRedeemed: 0, walletBalance: 5000, organizationName: 'Accra Nightlife'
  },
];