import { Timestamps, ID, PaginationParams } from '../common';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventType = 'concert' | 'conference' | 'workshop' | 'meetup' | 'other';

export interface Event extends Timestamps {
  id: ID;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  type: EventType;
  status: EventStatus;
  startDate: string | Date;
  endDate: string | Date;
  timezone: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  coverImage: string;
  organizerId: ID;
  organizer: {
    id: ID;
    name: string;
    avatar?: string;
  };
  capacity: number;
  availableTickets: number;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  isFree: boolean;
  metadata?: Record<string, any>;
}

export interface EventFilters extends PaginationParams {
  query?: string;
  type?: EventType | 'all';
  status?: EventStatus | 'all';
  date?: 'upcoming' | 'past' | 'all';
  price?: 'free' | 'paid' | 'all';
  category?: string;
  organizerId?: ID;
  featured?: boolean;
}

export interface CreateEventDto
  extends Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'organizer' | 'availableTickets'> {
  organizerId: ID;
  ticketTypes: TicketTypeDto[];
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

interface TicketTypeDto {
  id?: ID;
  name: string;
  description: string;
  price: number;
  quantity: number;
  minPerOrder: number;
  maxPerOrder: number;
  salesStartDate: string | Date;
  salesEndDate: string | Date;
  isActive: boolean;
}
