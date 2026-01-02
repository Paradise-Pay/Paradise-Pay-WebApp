// public/data/marketingData.ts

export type Channel = 'Email' | 'SMS';
export type CampaignStatus = 'Sent' | 'Scheduled' | 'Draft';
export type PromoStatus = 'Active' | 'Expired' | 'Disabled';

export interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  audience: string; // e.g. "VIP Users", "All Users"
  recipients: number;
  openRate?: number; // percentage
  status: CampaignStatus;
  date: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: string; // e.g. "20%" or "GH₵ 50"
  uses: number;
  maxUses: number;
  status: PromoStatus;
}

export interface TierConversion {
  path: string; // e.g. "Free -> Paradise+"
  count: number;
  revenue: number;
}

export const mockCampaigns: Campaign[] = [
  { id: 'c1', name: 'AfroFuture Early Bird', channel: 'Email', audience: 'All Users', recipients: 25000, openRate: 45, status: 'Sent', date: '2025-11-01' },
  { id: 'c2', name: 'Weekend Flash Sale', channel: 'SMS', audience: 'Active Users', recipients: 5000, openRate: 88, status: 'Sent', date: '2025-12-20' },
  { id: 'c3', name: 'New Year VIP Drop', channel: 'Email', audience: 'Paradise+ Users', recipients: 1200, status: 'Scheduled', date: '2026-01-05' },
  { id: 'c4', name: 'Loyalty Bonus', channel: 'SMS', audience: 'Paradise X Users', recipients: 300, status: 'Draft', date: 'TBD' },
];

export const mockPromos: PromoCode[] = [
  { id: 'p1', code: 'WELCOME2026', discount: '10%', uses: 450, maxUses: 1000, status: 'Active' },
  { id: 'p2', code: 'VIP50', discount: 'GH₵ 50', uses: 100, maxUses: 100, status: 'Expired' },
  { id: 'p3', code: 'SQUADGOALS', discount: '15%', uses: 12, maxUses: 500, status: 'Active' },
];

export const mockTierStats: TierConversion[] = [
  { path: 'Free → Paradise+', count: 1250, revenue: 62500 },
  { path: 'Paradise+ → Paradise X', count: 340, revenue: 51000 },
  { path: 'Free → Paradise X', count: 85, revenue: 21250 },
];