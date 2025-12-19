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
  platform?: 'ticketmaster' | 'eventbrite';
  keyword?: string;
  city?: string;
  date?: string;
  limit?: number;
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

    if (params.platform) queryParams.append('platform', params.platform);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.city) queryParams.append('city', params.city);
    if (params.date) queryParams.append('date', params.date);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    return apiClient.get(`${API_ENDPOINTS.INTEGRATIONS.SEARCH}?${queryParams.toString()}`);
  },

  // Import event from third-party platform
  importEvent: async (platform: 'ticketmaster' | 'eventbrite', event_id: string, category_id: string): Promise<{
    event: EventIntegration & {
      source: 'ticketmaster' | 'eventbrite';
      imported: boolean;
      importedEventId?: string;
    };
    message: string;
  }> => {
    return apiClient.post(API_ENDPOINTS.INTEGRATIONS.IMPORT, { platform, event_id, category_id });
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
