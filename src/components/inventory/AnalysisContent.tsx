
import React, { useState, useEffect } from 'react';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalysisProductsGrid from './analysis/AnalysisProductsGrid';

// Define QuantityOption type consistently in this file
export type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000 | 8000;

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
    };
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
        
        <TabsContent value="products" className="mt-0">
          <AnalysisProductsGrid 
            analysisProducts={analysisProducts} 
            isLoading={isLoading}
            refetchAnalysis={refetchAnalysis}
          />
        </TabsContent>
        
        <TabsContent value="simulation" className="mt-0">
          <div className="rounded-md border border-[#272727] p-8 flex items-center justify-center">
            <p className="text-gray-400">Module de simulation tarifaire</p>
          </div>
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
