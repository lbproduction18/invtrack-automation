
export type Product = {
  id: string;
  SKU: string;
  product_name?: string | null;
  current_stock: number;
  threshold: number;
  created_at: string;
  updated_at?: string;
  priority_badge: 'standard' | 'moyen' | 'prioritaire' | 'important';
  note?: string | null;
  price_1000?: number | null;
  price_2000?: number | null;
  price_3000?: number | null;
  price_4000?: number | null;
  price_5000?: number | null;
  price_8000?: number | null;
  last_order_quantity?: number | null;
  last_order_date?: string | null;
  lab_status?: string | null;
  estimated_delivery_date?: string | null;
  status?: string;
};

