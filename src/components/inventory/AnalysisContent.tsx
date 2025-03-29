
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AnalysisProductsGrid from '@/components/inventory/analysis/AnalysisProductsGrid';
import BudgetSimulation from '@/components/inventory/analysis/BudgetSimulation';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { type Product } from '@/types/product';

// Export types needed by other components
export type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000 | 8000;

export interface AnalysisProduct {
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
  productDetails?: Product;
}

const AnalysisContent: React.FC = () => {
  const { analysisItems, isLoading: isAnalysisLoading, refetch: refetchAnalysis } = useAnalysisItems();
  const { products } = useProducts('analysis');
  
  // Combine analysis items with product details
  const analysisProducts: AnalysisProduct[] = analysisItems.map(item => {
    const productDetails = products.find(p => p.id === item.product_id);
    return {
      ...item,
      productDetails
    };
  });

  // Handle order creation
  const handleCreateOrder = () => {
    console.log('Creating order...');
    // Order creation logic would go here
  };

  return (
    <CardContent className="p-4">
      <div className="space-y-6">
        <AnalysisProductsGrid 
          analysisProducts={analysisProducts}
          isLoading={isAnalysisLoading}
          refetchAnalysis={refetchAnalysis}
        />
        
        <div className="mt-8">
          <BudgetSimulation onCreateOrder={handleCreateOrder} />
        </div>
      </div>
    </CardContent>
  );
};

export default AnalysisContent;
