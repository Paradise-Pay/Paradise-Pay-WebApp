// public/data/ticketsControlData.ts

export type InventoryStatus = 'Active' | 'Paused' | 'Sold Out';
export type FraudSeverity = 'High' | 'Medium' | 'Low';

export interface TicketItem {
  id: string;
  name: string; // e.g., "VIP Pass"
  eventName: string;
  type: 'Ticket' | 'Bundle';
  price: number;
  sold: number;
  capacity: number;
  status: InventoryStatus;
}

export interface FraudAlert {
  id: string;
  user: string;
  event: string;
  reason: string;
  severity: FraudSeverity;
  timestamp: string;
  status: 'Open' | 'Resolved';
}

export const mockInventory: TicketItem[] = [
  { id: '1', name: 'Early Bird General', eventName: 'AfroFuture 2025', type: 'Ticket', price: 150, sold: 500, capacity: 500, status: 'Sold Out' },
  { id: '2', name: 'VIP Experience', eventName: 'AfroFuture 2025', type: 'Ticket', price: 450, sold: 120, capacity: 200, status: 'Active' },
  { id: '3', name: 'Squad Pack (5 Tix)', eventName: 'AfroFuture 2025', type: 'Bundle', price: 600, sold: 45, capacity: 100, status: 'Active' },
  { id: '4', name: 'Standard Entry', eventName: 'Tech Expo', type: 'Ticket', price: 50, sold: 800, capacity: 1000, status: 'Paused' },
];

export const mockFraudAlerts: FraudAlert[] = [
  { id: 'f1', user: 'Unknown (Guest)', event: 'AfroFuture 2025', reason: 'Duplicate QR Code Scan (Gate B)', severity: 'High', timestamp: '10 mins ago', status: 'Open' },
  { id: 'f2', user: 'Kojo Antwi', event: 'Tech Expo', reason: 'Unusual Purchase Velocity (10 tx in 1 min)', severity: 'Medium', timestamp: '2 hours ago', status: 'Open' },
  { id: 'f3', user: 'Ama Osei', event: 'Jazz Night', reason: 'Location Mismatch (IP vs Billing)', severity: 'Low', timestamp: '1 day ago', status: 'Resolved' },
];