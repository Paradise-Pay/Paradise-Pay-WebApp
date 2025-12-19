// API base URLs
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    RESET_PASSWORD_REQUEST: '/auth/reset-password-request',
    RESET_PASSWORD: '/auth/reset-password',
  },
  EVENTS: {
    SEARCH: '/events/search',
    FEATURED: '/events/featured',
    CATEGORIES: '/events/categories',
    BY_ID: (id: string) => `/events/${id}`,
    TICKET_TYPES: (eventId: string) => `/events/${eventId}/ticket-types`,
    FAVORITES: {
      ADD: (eventId: string) => `/events/${eventId}/favorites`,
      REMOVE: (eventId: string) => `/events/${eventId}/favorites`,
      LIST: '/events/favorites/list',
    },
    ORGANIZER: '/events/organizer/events',
    ANALYTICS: (eventId: string) => `/events/${eventId}/analytics`,
    CREATE: '/events',
    UPDATE: (eventId: string) => `/events/${eventId}`,
    DELETE: (eventId: string) => `/events/${eventId}`,
    CREATE_TICKET_TYPE: (eventId: string) => `/events/${eventId}/ticket-types`,
  },
  TICKETS: {
    PURCHASE: '/tickets/purchase',
    CONFIRM_BOOKING: (bookingId: string) => `/tickets/bookings/${bookingId}/confirm`,
    CANCEL_BOOKING: (bookingId: string) => `/tickets/bookings/${bookingId}/cancel`,
    VALIDATE: '/tickets/validate',
    MARK_USED: (ticketId: string) => `/tickets/${ticketId}/use`,
    USER_TICKETS: '/tickets/user/tickets',
    USER_BOOKINGS: '/tickets/bookings/user',
    BOOKING_DETAILS: (bookingId: string) => `/tickets/bookings/${bookingId}`,
    TICKET_DETAILS: (ticketId: string) => `/tickets/${ticketId}`,
    STATISTICS: '/tickets/statistics/overview',
    QR_CODE: (ticketNumber: string) => `/tickets/qr/${ticketNumber}`,
  },
  INTEGRATIONS: {
    SEARCH: '/integrations/search',
    IMPORT: '/integrations/import',
    CATEGORIES: '/integrations/categories',
    TICKETMASTER_EVENT: (eventId: string) => `/integrations/ticketmaster/events/${eventId}`,
    EVENTBRITE_EVENT: (eventId: string) => `/integrations/eventbrite/events/${eventId}`,
  },
};

// Common headers for API requests
export const getDefaultHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});
