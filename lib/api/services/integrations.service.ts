import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export interface EventIntegration {
  id: string;
  source: 'ticketmaster' | 'eventbrite' | 'other';
  sourceId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  timezone: string;
  location: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  imageUrl?: string;
  url: string;
  category?: string;
  priceRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  isFree?: boolean;
  imported: boolean;
  importedEventId?: string;
}

export interface IntegrationCategory {
  id: string;
  name: string;
  source: 'ticketmaster' | 'eventbrite' | 'other';
  parentId?: string;
}

export interface IntegrationSearchParams {
  query?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  radius?: number; // in miles or km
  size?: number;
  page?: number;
  sort?: 'date,asc' | 'date,desc' | 'name,asc' | 'name,desc';
}

export const integrationsService = {
  // Search events from third-party platforms
  searchEvents: async (params: IntegrationSearchParams): Promise<{
    events: EventIntegration[];
    total: number;
    page: number;
    size: number;
  }> => {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.category) queryParams.append('category', params.category);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.location) queryParams.append('location', params.location);
    if (params.radius) queryParams.append('radius', params.radius.toString());
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.sort) queryParams.append('sort', params.sort);

    return apiClient.get(`${API_ENDPOINTS.INTEGRATIONS.SEARCH}?${queryParams.toString()}`);
  },

  // Import event from third-party platform
  importEvent: async (source: 'ticketmaster' | 'eventbrite', sourceId: string): Promise<{
    event: EventIntegration & {
      source: 'ticketmaster' | 'eventbrite';
      imported: boolean;
      importedEventId?: string;
    };
    message: string;
  }> => {
    return apiClient.post(API_ENDPOINTS.INTEGRATIONS.IMPORT, { source, sourceId });
  },

  // Get categories from third-party platforms
  getCategories: async (source?: 'ticketmaster' | 'eventbrite'): Promise<IntegrationCategory[]> => {
    const url = source 
      ? `${API_ENDPOINTS.INTEGRATIONS.CATEGORIES}?source=${source}`
      : API_ENDPOINTS.INTEGRATIONS.CATEGORIES;
    
    return apiClient.get(url);
  },

  // Get Ticketmaster event details
  getTicketmasterEvent: async (eventId: string): Promise<EventIntegration> => {
    return apiClient.get(API_ENDPOINTS.INTEGRATIONS.TICKETMASTER_EVENT(eventId));
  },

  // Get Eventbrite event details
  getEventbriteEvent: async (eventId: string): Promise<EventIntegration> => {
    return apiClient.get(API_ENDPOINTS.INTEGRATIONS.EVENTBRITE_EVENT(eventId));
  },

  // Helper to get event by source and ID
  getEventBySource: async (source: 'ticketmaster' | 'eventbrite', eventId: string): Promise<EventIntegration> => {
    return source === 'ticketmaster'
      ? integrationsService.getTicketmasterEvent(eventId)
      : integrationsService.getEventbriteEvent(eventId);
  },
};
