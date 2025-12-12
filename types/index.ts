// Common types
export * from './common';

// Domain models
export * from './domain/user';
export * from './domain/event';
export * from './domain/ticket';
export * from './domain/order';
export * from './domain/payment';

// API requests
export * as AuthRequests from './api/requests/auth.requests';

// API responses
export * as AuthResponses from './api/responses/auth.responses';

// Form types
export * as AuthForms from './forms/auth.forms';
export * as UserForms from './forms/user.forms';

// Re-export commonly used types for convenience
export type { ID } from './common';
export type { User, UserRole } from './domain/user';
export type { Event, EventStatus, EventType } from './domain/event';
export type { Ticket, TicketStatus } from './domain/ticket';
export type { Order, OrderStatus } from './domain/order';
export type { PaymentMethod, Transaction, PaymentStatus } from './domain/payment';
