// public/data/eventsData.ts

export type EventStatus = 'Live' | 'Upcoming' | 'Ended';

export interface TicketTier {
  name: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface EventAnalytics {
  peakTime: string;
  abandonedCarts: number;
  checkInCount: number;
  totalTickets: number;
  salesByType: { name: string; percentage: number }[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  organizer: string;
  ticketsSold: number;
  totalCapacity: number;
  status: EventStatus;
  hasBundles: boolean;
  tiers: TicketTier[];
  analytics: EventAnalytics;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AfroFuture 2025',
    date: '2025-12-28',
    organizer: 'Culture Quest',
    ticketsSold: 4500,
    totalCapacity: 5000,
    status: 'Upcoming',
    hasBundles: true,
    tiers: [
      { name: 'General', price: 150, quantity: 4000, sold: 3800 },
      { name: 'VIP', price: 450, quantity: 1000, sold: 700 }
    ],
    analytics: {
      peakTime: 'Friday 6PM - 9PM',
      abandonedCarts: 342,
      checkInCount: 0,
      totalTickets: 5000,
      salesByType: [
        { name: 'General', percentage: 95 },
        { name: 'VIP', percentage: 70 }
      ]
    }
  },
  {
    id: '2',
    title: 'Tech Expo Ghana',
    date: '2025-11-15',
    organizer: 'Tech Connect',
    ticketsSold: 120,
    totalCapacity: 200,
    status: 'Live',
    hasBundles: false,
    tiers: [{ name: 'Standard', price: 0, quantity: 200, sold: 120 }],
    analytics: {
      peakTime: 'Monday 9AM',
      abandonedCarts: 12,
      checkInCount: 85,
      totalTickets: 120, // Only counting sold for check-in ratio
      salesByType: [{ name: 'Standard', percentage: 60 }]
    }
  }
];