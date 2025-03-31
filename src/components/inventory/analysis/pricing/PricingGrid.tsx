
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProductPrices } from '@/hooks/useProductPrices';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { usePricingCalculation } from '@/components/inventory/analysis/pricing/usePricingCalculation';
import PriceTable from '@/components/inventory/analysis/pricing/PriceTable';
import SimulationSummary from '@/components/inventory/analysis/pricing/SimulationSummary';
import UpdatePricesButton from '@/components/inventory/analysis/pricing/UpdatePricesButton';
import RefreshPriceGridButton from '@/components/inventory/analysis/pricing/RefreshPriceGridButton';
import { Loader2 } from 'lucide-react';

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading: isPricesLoading, refetch: refetchPrices } = useProductPrices();
  const { products, isLoading: isProductsLoading } = useProducts('analysis');
  const { analysisItems, isLoading: isAnalysisLoading, refetch: refetchAnalysis } = useAnalysisItems();
  
  // Get the SKUs of products that are in analysis
  const analysisProductSKUs = products.map(product => ({
    id: product.id,
    SKU: product.SKU
  }));
  
  // Use our custom hook for pricing calculations
  const {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    handleSKUSelect,
    handleSKURemove,
    handleQuantityChange,
    getTotalForProduct,
  } = usePricingCalculation(productPrices);
  
  const isLoading = isPricesLoading || isProductsLoading || isAnalysisLoading;

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([
      refetchPrices(),
      refetchAnalysis()
    ]);
  };

  // Refresh data on component mount
  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <CardHeader className="px-4 py-3 border-b border-[#272727]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Grille Tarifaire</CardTitle>
          <div className="flex space-x-2">
            <RefreshPriceGridButton onRefresh={handleRefresh} />
            <UpdatePricesButton 
              productPrices={productPrices}
              selectedSKUs={selectedSKUs}
              analysisItems={analysisItems}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="rounded-md border border-[#272727] overflow-hidden mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement des données...</span>
            </div>
          ) : (
            <PriceTable
              productPrices={productPrices}
              isLoading={isLoading}
              selectedSKUs={selectedSKUs}
              quantities={quantities}
              calculatedPrices={calculatedPrices}
              analysisProductSKUs={analysisProductSKUs}
              handleSKUSelect={handleSKUSelect}
              handleSKURemove={handleSKURemove}
              handleQuantityChange={handleQuantityChange}
              getTotalForProduct={getTotalForProduct}
              formatTotalPrice={(price) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          )}
        </div>
        
        {/* Improved simulation summary with integrated total section */}
        <SimulationSummary 
          analysisItems={analysisItems}
          products={products}
          simulationTotal={simulationTotal}
        />
      </CardContent>
    </Card>
  );
};

export default PricingGrid;
