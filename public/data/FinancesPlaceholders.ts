// public/data/financesData.ts

export type PayoutStatus = 'Pending' | 'Processing' | 'Paid' | 'Hold';
export type RefundStatus = 'Requested' | 'Approved' | 'Rejected' | 'Disputed';
export type DealType = 'Banking' | 'Sponsorship' | 'Premium Tier';

export interface Payout {
  id: string;
  organizer: string;
  eventName: string;
  amount: number;
  commission: number;
  netPayout: number;
  dateScheduled: string;
  status: PayoutStatus;
}

export interface RefundRequest {
  id: string;
  user: string;
  event: string;
  amount: number;
  reason: string;
  date: string;
  status: RefundStatus;
}

export interface Partnership {
  id: string;
  partner: string;
  type: DealType;
  revenueGenerated: number;
  status: 'Active' | 'Negotiating';
  renewalDate: string;
}

export const mockPayouts: Payout[] = [
  { id: 'p1', organizer: 'Culture Quest', eventName: 'AfroFuture 2025', amount: 45000, commission: 2250, netPayout: 42750, dateScheduled: '2026-01-05', status: 'Pending' },
  { id: 'p2', organizer: 'Tech Connect', eventName: 'Tech Expo', amount: 12000, commission: 600, netPayout: 11400, dateScheduled: '2026-01-03', status: 'Processing' },
  { id: 'p3', organizer: 'Accra Nightlife', eventName: 'Jazz Night', amount: 5000, commission: 250, netPayout: 4750, dateScheduled: '2025-12-28', status: 'Paid' },
];

export const mockRefunds: RefundRequest[] = [
  { id: 'r1', user: 'Kwame Mensah', event: 'AfroFuture 2025', amount: 450, reason: 'Duplicate Charge', date: '2026-01-01', status: 'Requested' },
  { id: 'r2', user: 'Sarah Smith', event: 'Tech Expo', amount: 150, reason: 'Event Cancelled', date: '2025-12-30', status: 'Approved' },
  { id: 'r3', user: 'John Doe', event: 'Jazz Night', amount: 50, reason: 'Accidental Purchase', date: '2025-12-29', status: 'Disputed' },
];

export const mockPartnerships: Partnership[] = [
  { id: 'pt1', partner: 'Ecobank', type: 'Banking', revenueGenerated: 15000, status: 'Active', renewalDate: '2026-06-01' },
  { id: 'pt2', partner: 'MTN', type: 'Sponsorship', revenueGenerated: 25000, status: 'Active', renewalDate: '2026-08-15' },
  { id: 'pt3', partner: 'Visa', type: 'Premium Tier', revenueGenerated: 8500, status: 'Negotiating', renewalDate: '2026-02-01' },
];