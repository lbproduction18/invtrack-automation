
import React, { useState, useEffect } from 'react';
import { useAnalysisItems, type AnalysisItem } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisProductsGrid from './analysis/AnalysisProductsGrid';
import BudgetSimulation from './analysis/BudgetSimulation';
import PricingGrid from './analysis/PricingGrid';

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
  } | null;
}

// Named export to match import in Index.tsx
export const AnalysisContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 bg-[#161616] border border-[#272727]">
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-[#272727] data-[state=active]:text-white"
          >
            Produits en analyse
          </TabsTrigger>
          <TabsTrigger 
            value="simulation" 
            className="data-[state=active]:bg-[#272727] data-[state=active]:text-white"
          >
            Simulation tarifaire
          </TabsTrigger>
          <TabsTrigger 
            value="budget" 
            className="data-[state=active]:bg-[#272727] data-[state=active]:text-white"
          >
            Budget & financement
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-0 space-y-8">
          <AnalysisProductsGrid 
            analysisProducts={analysisProducts} 
            isLoading={isLoading}
            refetchAnalysis={refetchAnalysis}
          />
          
          <div>
            <h2 className="text-lg font-medium mb-4">Grille tarifaire</h2>
            <PricingGrid />
          </div>
        </TabsContent>
        
        <TabsContent value="simulation" className="mt-0">
          <BudgetSimulation
            onCreateOrder={() => {}}
          />
        </TabsContent>
        
        <TabsContent value="budget" className="mt-0">
          <div className="rounded-md border border-[#272727] p-8 flex items-center justify-center">
            <p className="text-gray-400">Module de budget & financement</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Also add default export to maintain compatibility
export default AnalysisContent;
