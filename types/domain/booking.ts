import { Timestamps, ID, PaginationParams } from '../common';
import { Event } from './event';
import { User } from './user';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Booking extends Timestamps {
  id: ID;
  userId: ID;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  eventId: ID;
  event: Pick<Event, 'id' | 'title' | 'startDate' | 'endDate' | 'location' | 'coverImage'>;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReference?: string;
  paymentDetails?: Record<string, unknown>;
  tickets: Array<{
    id: ID;
    ticketTypeId: ID;
    ticketType: {
      id: ID;
      name: string;
      description: string;
      price: number;
    };
    quantity: number;
    price: number;
    status: BookingStatus;
  }>;
  metadata?: Record<string, unknown>;
}

export interface BookingFilters extends PaginationParams {
  userId?: ID;
  eventId?: ID;
  status?: BookingStatus | 'all';
  paymentStatus?: PaymentStatus | 'all';
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface CreateBookingDto {
  eventId: ID;
  tickets: Array<{
    ticketTypeId: ID;
    quantity: number;
  }>;
  paymentMethod: string;
  paymentDetails?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentReference?: string;
  metadata?: Record<string, unknown>;
}
