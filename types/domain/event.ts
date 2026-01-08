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

// Define the shape of the raw data from the backend
export interface OrganizerEventResponse {
  event_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_end_date: string;
  venue_name?: string;
  event_image_url?: string;
  status: string;
  max_attendees?: number;
  tickets_sold?: number;
  ticket_price?: string | number;
  category_id?: string;
  organizer_id?: string;
  created_at?: string;
}

export interface EventCategoryResponse {
  category_id: string;
  name: string;
  description?: string;
  icon_url?: string;
  created_at?: string;
}

export interface EventDetailResponse {
  event_id: string;
  title: string;
  description?: string;
  event_date: string;
  event_end_date?: string;
  venue_name?: string;
  venue_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  event_image_url?: string;
  event_banner_url?: string;
  status: string;
  category_id?: string;
  tags?: string[] | string;
  max_attendees?: number;
  tickets_sold?: number;
  ticket_price?: string | number;
  currency?: string;
  organizer_id?: string;
}