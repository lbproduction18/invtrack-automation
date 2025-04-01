
// This is the type used in the frontend UI
export type PriorityLevel = 'standard' | 'moyen' | 'prioritaire' | 'important';

// This type represents what's actually allowed in the Supabase database
export type DatabasePriorityLevel = 'standard' | 'moyen' | 'prioritaire';

export interface Product {
  id: string;
  SKU: string;
  product_name: string | null;
  current_stock: number;
  threshold: number;
  created_at: string;
  updated_at: string;
  priority_badge: PriorityLevel;
  note: string | null;
  price_1000: number;
  price_2000: number;
  price_3000: number;
  price_4000: number;
  price_5000: number;
  price_8000?: number;
  last_order_quantity: number | null;
  last_order_date: string | null;
  lab_status: string | null;
  estimated_delivery_date: string | null;
  status: string | null;
  weeks_delivery?: string | null; // Made this optional
}

// Define type for SKU selection
export interface SelectedSKU {
  productId: string;
  SKU: string;
  productName: string | null;
  quantity: number;
  price: number;
}
