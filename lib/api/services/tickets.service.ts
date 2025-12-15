import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import { Ticket, TicketStatus } from '@/types/domain/ticket';
import { Event } from '@/types/domain/event';

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  available: number;
  salesStart: string;
  salesEnd: string;
  minPerOrder: number;
  maxPerOrder: number;
  isActive: boolean;
}

export interface TicketPurchaseData {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  paymentMethod: 'card' | 'bank_transfer' | 'crypto';
  paymentDetails: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    // Add other payment method specific fields as needed
  };
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentReference: string;
  tickets: {
    id: string;
    ticketTypeId: string;
    ticketNumber: string;
    status: 'valid' | 'used' | 'cancelled';
    usedAt: string | null;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketValidationData {
  ticketNumber: string;
  eventId: string;
}

export const ticketsService = {
  // Get ticket types for an event
  getTicketTypes: async (eventId: string): Promise<TicketType[]> => {
    return apiClient.get(API_ENDPOINTS.EVENTS.TICKET_TYPES(eventId));
  },

  // Create a new ticket type for an event
  createTicketType: async (eventId: string, ticketTypeData: Omit<TicketType, 'id' | 'eventId' | 'available'>): Promise<TicketType> => {
    return apiClient.post(API_ENDPOINTS.EVENTS.TICKET_TYPES(eventId), ticketTypeData);
  },

  // Purchase tickets
  purchaseTickets: async (data: TicketPurchaseData): Promise<{ booking: Booking; paymentUrl?: string }> => {
    return apiClient.post(API_ENDPOINTS.TICKETS.PURCHASE, data);
  },

  // Confirm payment and activate tickets
  confirmBooking: async (bookingId: string, paymentReference: string): Promise<Booking> => {
    return apiClient.post(API_ENDPOINTS.TICKETS.CONFIRM_BOOKING(bookingId), { paymentReference });
  },

  // Cancel booking and refund tickets
  cancelBooking: async (bookingId: string, reason?: string): Promise<Booking> => {
    return apiClient.post(API_ENDPOINTS.TICKETS.CANCEL_BOOKING(bookingId), { reason });
  },

  // Validate ticket for event entry
  validateTicket: async (data: TicketValidationData): Promise<{
    isValid: boolean;
    message: string;
    ticket?: Ticket & {
      event: Pick<Event, 'id' | 'title' | 'startDate'>;
      ticketType: Pick<TicketType, 'id' | 'name' | 'price'>;
    };
  }> => {
    return apiClient.post(API_ENDPOINTS.TICKETS.VALIDATE, data);
  },

  // Mark ticket as used for event entry
  markTicketAsUsed: async (ticketId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post(API_ENDPOINTS.TICKETS.MARK_USED(ticketId));
  },

  // Get user's tickets
  getUserTickets: async (): Promise<Array<{
    ticket: {
      id: string;
      ticketNumber: string;
      status: TicketStatus;
      usedAt: string | null;
    };
    event: Pick<Event, 'id' | 'title' | 'startDate' | 'endDate' | 'location' | 'coverImage'>;
    ticketType: Pick<TicketType, 'id' | 'name' | 'description' | 'price'>;
  }>> => {
    return apiClient.get(API_ENDPOINTS.TICKETS.USER_TICKETS);
  },

  // Get user's bookings
  getUserBookings: async (): Promise<Booking[]> => {
    return apiClient.get(API_ENDPOINTS.TICKETS.USER_BOOKINGS);
  },

  // Get booking details
  getBookingDetails: async (bookingId: string): Promise<Booking> => {
    return apiClient.get(API_ENDPOINTS.TICKETS.BOOKING_DETAILS(bookingId));
  },

  // Get ticket details
  getTicketDetails: async (ticketId: string): Promise<{
    ticket: Ticket;
    event: Event;
    booking: Booking;
  }> => {
    return apiClient.get(API_ENDPOINTS.TICKETS.TICKET_DETAILS(ticketId));
  },

  // Get ticket QR code and details
  getTicketQRCode: async (ticketNumber: string): Promise<{
    qrCode: string;
    ticket: Ticket;
    event: Pick<Event, 'id' | 'title' | 'startDate' | 'endDate' | 'location'>;
  }> => {
    return apiClient.get(API_ENDPOINTS.TICKETS.QR_CODE(ticketNumber));
  },

  // Get booking and ticket statistics
  getStatistics: async (): Promise<{
    totalBookings: number;
    totalTickets: number;
    totalEvents: number;
    totalRevenue: number;
    upcomingEvents: number;
    pastEvents: number;
  }> => {
    return apiClient.get(API_ENDPOINTS.TICKETS.STATISTICS);
  },
};
