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
