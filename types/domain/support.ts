export interface SupportTicket {
  ticket_id: string;
  user_id: string;
  subject: string;
  description: string;
  category: 'General' | 'Billing' | 'Technical' | 'Event' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  responses?: TicketResponse[]; // Included when fetching single ticket
}

export interface TicketResponse {
  response_id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
  user?: { // If your repo joins user data
    name: string;
    avatar?: string;
    role: string;
  };
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  category: string;
  priority: string;
}

export interface SupportSearchParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
  status?: string;
  priority?: string;
  category?: string;
  assigned_to?: string; // Admin only
  user_id?: string;     // Admin only
}