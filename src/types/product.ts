
export type Product = {
  id: string;
  SKU: string;
  name: string;
  description: string;
  unit: string;
  current_stock: number;
  threshold: number;
  avg_sales: number;
  lead_time: number;
  supplier_id: string;
  supplier_name?: string;
  created_at: string;
  updated_at: string;
};
