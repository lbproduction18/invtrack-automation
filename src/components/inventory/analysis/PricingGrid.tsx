
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
import { Button } from '@/components/ui/button';
import { Loader2, RotateCw, RefreshCw } from 'lucide-react';
import { formatTotalPrice } from '@/components/inventory/analysis/pricing/PriceFormatter';
import { useBudgetSimulation } from './simulation/useBudgetSimulation';

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading: isPricesLoading, refetch: refetchPrices } = useProductPrices();
  const { products, isLoading: isProductsLoading } = useProducts('analysis');
  const { analysisItems, isLoading: isAnalysisLoading, refetch: refetchAnalysis } = useAnalysisItems();
  
  // Define the price tiers array
  const priceTiers = ['price_1000', 'price_2000', 'price_3000', 'price_4000', 'price_5000', 'price_8000'];
  
  // Initialize quantities with an empty record
  const initialQuantities: Record<string, number> = {};
  
  // Use the budget simulation hook to get the wrapper function
  const { getUnitPriceForSKU } = useBudgetSimulation(() => {});
  
  const analysisProductSKUs = products.map(product => ({
    id: product.id,
    SKU: product.SKU
  }));
  
  const {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    handleSKUSelect,
    handleSKURemove,
    handleQuantityChange,
    getTotalForProduct,
    resetSimulation,
  } = usePricingCalculation(analysisItems, initialQuantities, priceTiers);
  
  const isLoading = isPricesLoading || isProductsLoading || isAnalysisLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchPrices(),
      refetchAnalysis()
    ]);
  };

  const handleResetSimulation = () => {
    resetSimulation(); // Call the reset function from the hook
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <CardHeader className="px-4 py-3 border-b border-[#272727]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Grille Tarifaire</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {}} // No action for now
              className="text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222]"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Rafraîchir
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetSimulation}
              className="text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222]"
            >
              <RotateCw className="mr-2 h-3 w-3" />
              Réinitialiser
            </Button>
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
              formatTotalPrice={formatTotalPrice}
            />
          )}
        </div>
        
        <div className="mt-4">
          <SimulationSummary 
            analysisItems={analysisItems}
            products={products}
            simulationTotal={simulationTotal}
            selectedSKUs={selectedSKUs}
            quantities={quantities}
            calculatedPrices={calculatedPrices}
            productPrices={productPrices}
            getUnitPriceForSKU={getUnitPriceForSKU}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingGrid;
