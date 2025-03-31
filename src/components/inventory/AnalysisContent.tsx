
import React from 'react';
import AIEnabledAnalysisContent from './analysis/AIEnabledAnalysisContent';

export type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000 | 8000;

export interface AnalysisProduct {
  id: string;
  product_id: string;
  productDetails?: {
    SKU: string;
    product_name?: string;
    current_stock: number;
    threshold: number;
  };
  sku_code?: string;
  sku_label?: string;
  stock?: number;
  threshold?: number;
  last_order_info?: string | null;
  last_order_date?: string | null;
  last_order_quantity?: string | null;
  lab_status?: string | null;
  lab_status_text?: string | null;
  weeks_delivery?: string | null;
  note?: string | null;
  priority_badge?: string | null;
  date_added?: string | null;
}

const AnalysisContent: React.FC = () => {
  return <AIEnabledAnalysisContent />;
};

export default AnalysisContent;
