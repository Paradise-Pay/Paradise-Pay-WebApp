// public/data/supportData.ts

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
export type TicketPriority = 'High' | 'Medium' | 'Low';
export type KYCStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Ticket {
  id: string;
  user: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  submitted: string;
}

export interface KYCRequest {
  id: string;
  organizer: string;
  docType: string; // e.g., "Business Registration"
  submittedDate: string;
  status: KYCStatus;
}

export interface AuditLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface ComplianceCheck {
  id: string;
  name: string;
  status: 'Pass' | 'Fail' | 'Warning';
  lastRun: string;
}

export const mockTickets: Ticket[] = [
  { id: 'T-1024', user: 'Kwame Mensah', subject: 'Refund not received', category: 'Payment', status: 'Open', priority: 'High', submitted: '2 hours ago' },
  { id: 'T-1023', user: 'Ama Osei', subject: 'Cannot access ticket', category: 'Technical', status: 'In Progress', priority: 'Medium', submitted: '5 hours ago' },
  { id: 'T-1022', user: 'John Doe', subject: 'Event location wrong', category: 'General', status: 'Resolved', priority: 'Low', submitted: '1 day ago' },
];

export const mockKYC: KYCRequest[] = [
  { id: 'K-001', organizer: 'Accra Nightlife', docType: 'Business Cert (RGD)', submittedDate: '2026-01-02', status: 'Pending' },
  { id: 'K-002', organizer: 'Tech Connect', docType: 'ID Card (Ghana Card)', submittedDate: '2026-01-01', status: 'Rejected' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'L-554', admin: 'SuperAdmin', action: 'Changed Fees', target: 'Global Settings', timestamp: '10 mins ago' },
  { id: 'L-553', admin: 'SupportAgent_1', action: 'Refunded', target: 'Order #4451', timestamp: '1 hour ago' },
  { id: 'L-552', admin: 'SuperAdmin', action: 'Approved Organizer', target: 'Culture Quest', timestamp: '3 hours ago' },
];

export const mockCompliance: ComplianceCheck[] = [
  { id: 'c1', name: 'PCI DSS Payment Security', status: 'Pass', lastRun: 'Today, 09:00 AM' },
  { id: 'c2', name: 'GDPR / Data Privacy', status: 'Pass', lastRun: 'Today, 09:00 AM' },
  { id: 'c3', name: 'Organizer AML Checks', status: 'Warning', lastRun: 'Yesterday' },
];