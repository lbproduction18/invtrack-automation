
export type Product = {
  id: string;
  SKU: string;
  current_stock: number;
  threshold: number;
  created_at: string;
  updated_at?: string;
  priority_badge: 'standard' | 'moyen' | 'prioritaire';
  note?: string | null;
};
