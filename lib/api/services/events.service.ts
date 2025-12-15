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
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export const eventsService = {
  // Search events with filters
  searchEvents: async (filters: EventFilters): Promise<{ events: Event[]; total: number }> => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.searchQuery) params.append('search', filters.searchQuery);
    if (filters.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }
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
    return apiClient.post(API_ENDPOINTS.EVENTS.BY_ID(''), eventData);
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
