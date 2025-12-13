// API base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://paradise-pay-backend-production-e0db.up.railway.app';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/v1/auth/signup',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
  },
  EVENTS: {
    SEARCH: '/api/v1/events/search',
    FEATURED: '/api/v1/events/featured',
    CATEGORIES: '/api/v1/events/categories',
    BY_ID: (id: string) => `/api/v1/events/${id}`,
    TICKET_TYPES: (eventId: string) => `/events/${eventId}/ticket-types`,
    FAVORITES: {
      ADD: (eventId: string) => `/events/${eventId}/favorites`,
      REMOVE: (eventId: string) => `/events/${eventId}/favorites`,
      LIST: '/events/favorites',
    },
    ORGANIZER: '/events/organizer',
    ANALYTICS: (eventId: string) => `/api/v1/events/${eventId}/analytics`,
  },
  TICKETS: {
    PURCHASE: '/api/v1/tickets/purchase',
    CONFIRM_BOOKING: (bookingId: string) => `/api/v1/tickets/bookings/${bookingId}/confirm`,
    CANCEL_BOOKING: (bookingId: string) => `/api/v1/tickets/bookings/${bookingId}/cancel`,
    VALIDATE: '/api/v1/tickets/validate',
    MARK_USED: (ticketId: string) => `/api/v1/tickets/${ticketId}/use`,
    USER_TICKETS: '/api/v1/tickets/user',
    USER_BOOKINGS: '/api/v1/tickets/bookings/user',
    BOOKING_DETAILS: (bookingId: string) => `/api/v1/tickets/bookings/${bookingId}`,
    TICKET_DETAILS: (ticketId: string) => `/api/v1/tickets/${ticketId}`,
    STATISTICS: '/api/v1/tickets/statistics/overview',
    QR_CODE: (ticketNumber: string) => `/api/v1/tickets/qr/${ticketNumber}`,
  },
  INTEGRATIONS: {
    SEARCH: '/api/v1/integrations/search',
    IMPORT: '/api/v1/integrations/import',
    CATEGORIES: '/api/v1/integrations/categories',
    TICKETMASTER_EVENT: (eventId: string) => `/api/v1/integrations/ticketmaster/events/${eventId}`,
    EVENTBRITE_EVENT: (eventId: string) => `/api/v1/integrations/eventbrite/events/${eventId}`,
  },
};

// Common headers for API requests
export const getDefaultHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});
