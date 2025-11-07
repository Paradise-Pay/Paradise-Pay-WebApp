import { Timestamps, ID, PaginationParams } from '../common';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
export type PaymentMethodType = 'card' | 'bank' | 'paypal' | 'crypto' | 'wallet';
export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'payout' | 'transfer';

export interface PaymentMethod extends Timestamps {
  id: ID;
  userId: ID;
  type: PaymentMethodType;
  isDefault: boolean;
  isVerified: boolean;
  lastUsedAt?: string | Date | null;
  metadata: CardDetails | BankDetails | PayPalDetails | CryptoDetails;
}

export interface CardDetails {
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  nameOnCard: string;
  country: string;
  brand?: string;
  funding?: 'credit' | 'debit' | 'prepaid' | 'unknown';
}

export interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber?: string;
  accountType: 'checking' | 'savings';
  country: string;
  currency: string;
}

export interface PayPalDetails {
  email: string;
  accountId: string;
}

export interface CryptoDetails {
  currency: 'BTC' | 'ETH' | 'USDC' | 'USDT' | 'other';
  address: string;
  network: string;
  memo?: string;
}

export interface Transaction extends Timestamps {
  id: ID;
  userId: ID;
  type: TransactionType;
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  status: PaymentStatus;
  description: string;
  reference: string;
  paymentMethodId?: ID;
  paymentMethod?: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface CreatePaymentIntentDto {
  amount: number;
  currency: string;
  paymentMethodId?: ID;
  savePaymentMethod?: boolean;
  metadata?: Record<string, any>;
}

export interface ProcessPaymentDto {
  paymentIntentId: string;
  paymentMethodId?: ID;
  savePaymentMethod?: boolean;
}

export interface PaymentFilters extends PaginationParams {
  userId?: ID;
  status?: PaymentStatus | 'all';
  type?: TransactionType | 'all';
  startDate?: string | Date;
  endDate?: string | Date;
  minAmount?: number;
  maxAmount?: number;
  reference?: string;
}
