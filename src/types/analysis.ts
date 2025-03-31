
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface AnalysisItem {
  id: string;
  product_id: string;
  product_name: string;
  sku_code: string;
  priority_badge: string;
  current_stock: number;
  stock_threshold: number;
  note: string;
  date_added: string;
  status: AnalysisStatus;
  quantity_to_order: number;
  price_per_unit: number;
  created_at?: string;
  updated_at?: string;
}

export type QuantityOption = 1000 | 2000 | 3000 | 5000;

export interface SelectedSKU {
  id: string;
  SKU: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface BudgetSettings {
  id?: string;
  total_budget: number;
  deposit_percentage: number;
  notes: string;
}
