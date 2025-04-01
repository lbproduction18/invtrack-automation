import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useProductPrices } from '@/hooks/useProductPrices';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { usePricingCalculation } from './usePricingCalculation';
import { useBudgetSimulation } from '../simulation/useBudgetSimulation';
import { useSKUAssignmentCheck } from './hooks/useSKUAssignmentCheck';
import PricingGridHeader from './components/PricingGridHeader';
import PricingGridContent from './components/PricingGridContent';
import { formatTotalPrice, formatPrice } from './PriceFormatter';

interface PricingGridProps {
  showSimulationSummary?: boolean;
  analysisMode?: 'manual' | 'ai';
}

const PricingGrid: React.FC<PricingGridProps> = ({ 
  showSimulationSummary = true,
  analysisMode = 'manual'
}) => {
  const { productPrices, isLoading: isPricesLoading, refetch: refetchPrices } = useProductPrices();
  const { products, isLoading: isProductsLoading } = useProducts('analysis');
  const { analysisItems, isLoading: isAnalysisLoading, refetch: refetchAnalysis } = useAnalysisItems();
  
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
  } = usePricingCalculation(productPrices);
  
  const isLoading = isPricesLoading || isProductsLoading || isAnalysisLoading;
  const [isResetting, setIsResetting] = useState(false);

  const { allProductsHaveSKUs } = useSKUAssignmentCheck(
    analysisMode,
    isLoading,
    productPrices,
    selectedSKUs
  );

  const handleRefresh = async () => {
    await Promise.all([
      refetchPrices(),
      refetchAnalysis()
    ]);
  };

  const handleResetSimulation = async () => {
    setIsResetting(true);
    try {
      await resetSimulation();
    } catch (error) {
      console.error("Error during reset:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLaunchAIAnalysis = () => {
    console.log("Launching AI Analysis...");
  };

  const getUnitPriceWrapper = (productId: string, sku: string, quantity?: string): number => {
    const quantityStr = quantity || "1000";
    return getUnitPriceForSKU(productId, sku, quantityStr);
  };

  const formatPriceWrapper = (price: number): string => {
    return formatPrice(price) as string;
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <CardHeader className="px-4 py-3 border-b border-[#272727]">
        <PricingGridHeader
          handleRefresh={handleRefresh}
          handleResetSimulation={handleResetSimulation}
          isResetting={isResetting}
          analysisMode={analysisMode}
          productPrices={productPrices}
          selectedSKUs={selectedSKUs}
          analysisItems={analysisItems}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        <PricingGridContent
          analysisMode={analysisMode}
          isLoading={isLoading}
          allProductsHaveSKUs={allProductsHaveSKUs}
          simulationTotal={simulationTotal}
          showSimulationSummary={showSimulationSummary}
          productPrices={productPrices}
          selectedSKUs={selectedSKUs}
          quantities={quantities}
          calculatedPrices={calculatedPrices}
          analysisProductSKUs={analysisProductSKUs}
          analysisItems={analysisItems}
          products={products}
          isResetting={isResetting}
          handleSKUSelect={handleSKUSelect}
          handleSKURemove={handleSKURemove}
          handleQuantityChange={handleQuantityChange}
          handleLaunchAIAnalysis={handleLaunchAIAnalysis}
          handleResetSimulation={handleResetSimulation}
          getTotalForProduct={getTotalForProduct}
          getUnitPriceForSKU={getUnitPriceWrapper}
          formatPrice={formatPriceWrapper}
          formatTotalPrice={formatTotalPrice}
        />
      </CardContent>
    </Card>
  );
};

export default PricingGrid;
