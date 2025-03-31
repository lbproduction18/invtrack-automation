
import React, { useState } from 'react';
import { useAnalysisItems, type AnalysisItem } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import AnalysisProductsGrid from './analysis/AnalysisProductsGrid';
import AnalysisMethodSection from './analysis/AnalysisMethodSection';

// Define QuantityOption type consistently in this file
export type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000 | 8000;

// Define the interface for combined analysis items and product details
export interface AnalysisProduct extends AnalysisItem {
  productDetails: {
    id: string;
    SKU: string;
    product_name: string | null;
    current_stock: number;
    threshold: number;
    lab_status: string | null;
    estimated_delivery_date: string | null;
    last_order_date: string | null;
    last_order_quantity: number | null;
    note: string | null;
    priority_badge: string | null;
    created_at: string;
  } | null;
}

// Named export to match import in Index.tsx
export const AnalysisContent: React.FC = () => {
  // Fetch analysis items and products
  const { analysisItems, isLoading: isLoadingAnalysis, refetch: refetchAnalysis } = useAnalysisItems();
  const { products, isLoading: isLoadingProducts } = useProducts('all');
  
  // Combine analysis items with product details
  const analysisProducts = analysisItems.map(item => {
    const product = products.find(p => p.id === item.product_id);
    return {
      ...item,
      productDetails: product || null
    } as AnalysisProduct;
  }).filter(item => item.productDetails !== null);
  
  const isLoading = isLoadingAnalysis || isLoadingProducts;

  return (
    <div className="p-4 space-y-6">
      <AnalysisProductsGrid 
        analysisProducts={analysisProducts} 
        isLoading={isLoading}
        refetchAnalysis={refetchAnalysis}
      />
      
      <AnalysisMethodSection />
    </div>
  );
};

// Also add default export to maintain compatibility
export default AnalysisContent;
