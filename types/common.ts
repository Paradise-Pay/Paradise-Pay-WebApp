/**
 * Common pagination parameters for API requests
 */
export interface PaginationParams {
  /** The page number to return (1-based index) */
  page?: number;
  
  /** Number of items per page */
  limit?: number;
  
  /** Field to sort by */
  sortBy?: string;
  
  /** Sort direction: 'asc' or 'desc' */
  sortOrder?: 'asc' | 'desc';
}

/** Common fields that include timestamps */
export interface Timestamps {
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
}

/** Common ID type (string or number) */
export type ID = string | number;
