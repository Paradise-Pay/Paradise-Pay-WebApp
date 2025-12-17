import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl?: string;
  organizerId: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  city?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface CreateEventData {
  category_id: string;
  title: string;
  description: string;
  venue_name: string;
  venue_address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  event_date: string;
  event_end_date: string;
  registration_start_date: string;
  registration_end_date: string;
  max_attendees: number;
  ticket_price: number;
  currency: string;
  event_image_url?: string;
  event_banner_url?: string;
  status: string;
  is_featured: boolean;
  tags?: string[];
  external_platform?: string;
}

export const eventsService = {
  // Search events with filters
  searchEvents: async (filters: EventFilters): Promise<{ events: Event[]; total: number }> => {
    const params = new URLSearchParams();

    if (filters.city) params.append('city', filters.city);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    return apiClient.get(`${API_ENDPOINTS.EVENTS.SEARCH}?${params.toString()}`);
  },

  // Get featured events
  getFeaturedEvents: async (limit: number = 10): Promise<Event[]> => {
    return apiClient.get(`${API_ENDPOINTS.EVENTS.FEATURED}?limit=${limit}`);
  },

  // Get event categories
  getCategories: async (): Promise<string[]> => {
    return apiClient.get(API_ENDPOINTS.EVENTS.CATEGORIES);
  },

  // Get event by ID
  getEventById: async (eventId: string): Promise<Event> => {
    return apiClient.get(API_ENDPOINTS.EVENTS.BY_ID(eventId));
  },

  // Create a new event
  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    return apiClient.post(API_ENDPOINTS.EVENTS.CREATE, eventData);
  },

  // Update an event
  updateEvent: async (eventId: string, eventData: Partial<CreateEventData>): Promise<Event> => {
    return apiClient.put(API_ENDPOINTS.EVENTS.BY_ID(eventId), eventData);
  },

  // Delete an event
  deleteEvent: async (eventId: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.EVENTS.BY_ID(eventId));
  },

  // Get organizer's events
  getOrganizerEvents: async (): Promise<Event[]> => {
    return apiClient.get(API_ENDPOINTS.EVENTS.ORGANIZER);
  },

  // Add/remove from favorites
  addToFavorites: async (eventId: string): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.EVENTS.FAVORITES.ADD(eventId));
  },

  removeFromFavorites: async (eventId: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.EVENTS.FAVORITES.REMOVE(eventId));
  },

  // Get user's favorite events
  getFavoriteEvents: async (): Promise<Event[]> => {
    return apiClient.get(API_ENDPOINTS.EVENTS.FAVORITES.LIST);
  },
};
