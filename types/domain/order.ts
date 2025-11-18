import { Timestamps, ID, PaginationParams } from '../common';
import { User } from './user';
import { Event } from './event';
import { Ticket } from './ticket';

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded' | 'partially_refunded';

export interface OrderItem {
  id: ID;
  ticketTypeId: ID;
  ticketType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
}

export interface Order extends Timestamps {
  id: ID;
  userId: ID;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  eventId: ID;
  event: {
    id: ID;
    title: string;
    startDate: string | Date;
    location: string;
  };
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  fee: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  billingAddress: BillingAddress;
  tickets: Pick<Ticket, 'id' | 'qrCode' | 'status'>[];
  metadata?: Record<string, any>;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderDto {
  eventId: ID;
  items: Array<{
    ticketTypeId: ID;
    quantity: number;
  }>;
  paymentMethodId: ID;
  billingAddress: Omit<BillingAddress, 'email' | 'phone'>;
  promoCode?: string;
  metadata?: Record<string, any>;
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {
  status?: OrderStatus;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface OrderFilters extends PaginationParams {
  userId?: ID;
  eventId?: ID;
  status?: OrderStatus | 'all';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'all';
  startDate?: string | Date;
  endDate?: string | Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}
