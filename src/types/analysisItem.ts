
export interface AnalysisItem {
  id: string;
  product_id: string;
  quantity_selected: number | null;
  created_at: string;
  updated_at: string;
  status: string;
  last_order_info: string | null;
  lab_status_text: string | null;
  last_order_date: string | null;
  weeks_delivery: string | null; 
  sku_code: string | null;
  sku_label: string | null;
  price_1000: number | null;
  price_2000: number | null;
  price_3000: number | null;
  price_4000: number | null;
  price_5000: number | null;
  price_8000: number | null;
  stock: number | null;
  threshold: number | null;
  note?: string | null;
  priority_badge?: string | null;
  date_added?: string | null;
}
