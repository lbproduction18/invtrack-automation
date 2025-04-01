
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
  const [isResetting, setIsResetting] = useState(false);

  // Use the custom hook to check if all products have SKUs assigned
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
      // Call the reset function from the hook that now includes database reset
      await resetSimulation();
    } catch (error) {
      console.error("Error during reset:", error);
    } finally {
      setIsResetting(false);
    }
  };

  // Handler for the "Lancer l'analyse AI" button
  const handleLaunchAIAnalysis = () => {
    // This function would trigger the AI analysis process
    console.log("Launching AI Analysis...");
    // Add the actual implementation for launching AI analysis here
  };

  // Create a wrapper for getUnitPriceForSKU to make the types compatible with PricingGridContent
  const getUnitPriceWrapper = (productId: string, sku: string, quantity?: string): number => {
    // If quantity is undefined or empty, use a default value of "1000"
    const quantityStr = quantity || "1000";
    // No need to convert to number here, the function will handle the conversion internally
    return getUnitPriceForSKU(productId, sku, quantityStr);
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
        />
      </CardContent>
    </Card>
  );
};

export default PricingGrid;
