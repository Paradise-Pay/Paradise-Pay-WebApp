export interface Bundle {
  bundle_id: string;
  organizer_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  events?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateBundlePayload {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  event_ids?: string[];
}

export interface UpdateBundlePayload {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
}