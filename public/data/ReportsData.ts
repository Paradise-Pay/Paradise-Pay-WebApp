// public/data/analyticsData.ts

export type AlertType = 'Traffic' | 'Fraud' | 'Payment';
export type ReportType = 'Sales' | 'Revenue' | 'Demographics';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number; // For comparison
}

export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'Traffic', message: 'Traffic spike detected on "AfroFuture" checkout page (+300%)', timestamp: '2 mins ago', severity: 'Medium' },
  { id: 'a2', type: 'Payment', message: 'High failure rate (15%) with MTN Mobile Money', timestamp: '15 mins ago', severity: 'High' },
  { id: 'a3', type: 'Fraud', message: 'Multiple rapid transactions from IP 192.168.x.x', timestamp: '1 hour ago', severity: 'High' },
];

export const salesTrendData: ChartDataPoint[] = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 38 },
  { label: 'Thu', value: 65 },
  { label: 'Fri', value: 95 },
  { label: 'Sat', value: 85 },
  { label: 'Sun', value: 70 },
];

export const demographicsData: ChartDataPoint[] = [
  { label: '18-24', value: 35 },
  { label: '25-34', value: 45 },
  { label: '35-44', value: 15 },
  { label: '45+', value: 5 },
];

export const tableData = [
  { event: 'AfroFuture 2025', organizer: 'Culture Quest', revenue: 450000, tickets: 4500, conversion: '4.2%' },
  { event: 'Tech Expo', organizer: 'Tech Connect', revenue: 120000, tickets: 800, conversion: '2.8%' },
  { event: 'Jazz Night', organizer: 'Accra Nightlife', revenue: 50000, tickets: 450, conversion: '5.1%' },
  { event: 'Kumasi Food Fest', organizer: 'Ashanti Events', revenue: 85000, tickets: 1200, conversion: '3.5%' },
];