export type PriorityLevel = 'standard' | 'moyen' | 'prioritaire' | 'important';

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
  last_order_quantity: number | null;
  last_order_date: string | null;
  lab_status: string | null;
  estimated_delivery_date: string | null;
  status: string | null;
}
