import { Timestamps, ID, PaginationParams } from '../common';
import { Event } from './event';
import { User } from './user';

export type TicketStatus = 'active' | 'used' | 'cancelled' | 'refunded' | 'expired';

export interface TicketType extends Timestamps {
  id: ID;
  eventId: ID;
  name: string;
  description: string;
  price: number;
  quantity: number;
  minPerOrder: number;
  maxPerOrder: number;
  salesStartDate: string | Date;
  salesEndDate: string | Date;
  isActive: boolean;
  availableQuantity: number;
  metadata?: Record<string, any>;
}

export interface Ticket extends Timestamps {
  id: ID;
  eventId: ID;
  event: Pick<Event, 'id' | 'title' | 'startDate' | 'endDate' | 'location' | 'coverImage'>;
  ticketType: Pick<TicketType, 'id' | 'name' | 'description' | 'price'>;
  userId: ID;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  orderId: ID;
  status: TicketStatus;
  price: number;
  currency: string;
  qrCode: string;
  barcode: string;
  checkedIn: boolean;
  checkedInAt?: string | Date | null;
  checkedInBy?: ID | null;
  metadata?: Record<string, any>;
}

export interface CheckInTicketDto {
  ticketId: ID;
  eventId: ID;
  checkedInBy: ID;
  notes?: string;
}

export interface TicketFilters extends PaginationParams {
  eventId?: ID;
  userId?: ID;
  status?: TicketStatus | 'all';
  orderId?: ID;
  ticketTypeId?: ID;
  search?: string;
}

export interface TicketTypeDraft {
  name: string;
  description: string;
  price: number;
  available_quantity: number;
  max_per_user: number;
  sales_start_date: string;
  sales_end_date: string;
}

export interface TicketTypePayload {
  name: string;
  description?: string;
  price: number;
  currency: string;
  available_quantity: number;
  sales_start_date: string;
  sales_end_date: string;
  max_per_user?: number;
}

export interface TicketTypeResponse {
  ticket_type_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  available_quantity: number;
  sold_quantity: number;
  max_per_user?: number;
  sales_start_date: string;
  sales_end_date: string;
  is_active: boolean;
}

export interface TicketTypeResponse {
  ticket_type_id: string;     
  event_id: string;           
  name: string;
  description?: string;
  price: number;
  currency: string;
  available_quantity: number; 
  sold_quantity: number;      
  sales_start_date: string;
  sales_end_date: string;
  max_per_user?: number;      
  is_active: boolean;         
}

export interface PurchasePayload {
  event_id: string;
  ticket_type_id: string;
  quantity: number;
  attendee_details: {
    name: string;
    email: string;
    phone?: string;        
    seat_number?: string;  
  }[];
  payment_method: string;    
  payment_reference: string; 
  notes?: string;
}

export interface UserTicketResponse {
  ticket_id: string;
  ticket_number: string;
  status: 'valid' | 'used' | 'cancelled' | 'refunded';
  created_at: string;
  event_id: string;
  event_title: string;
  event_date: string;
  venue_name: string;
  city: string;
  event_image_url?: string;
  ticket_type_name: string;
  ticket_price: string | number;
  booking_reference: string;
}