
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
import { usePricingCalculation } from './usePricingCalculation';
import PriceTable from './PriceTable';
import SimulationSummary from './SimulationSummary';
import UpdatePricesButton from './UpdatePricesButton';
import { Loader2, RefreshCw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetSimulation } from '../simulation/useBudgetSimulation';
import { formatTotalPrice } from './PriceFormatter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

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
  } = usePricingCalculation(productPrices);

  // Animation states for buttons
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const isLoading = isPricesLoading || isProductsLoading || isAnalysisLoading;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchPrices(),
      refetchAnalysis()
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleResetSimulation = () => {
    setIsResetting(true);
    resetSimulation(); 
    setTimeout(() => setIsResetting(false), 500);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Card className="border border-[#272727] bg-[#131313] rounded-lg shadow-md overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-[#272727] bg-gradient-to-r from-[#151515] to-[#1A1A1A]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium tracking-wide">Grille Tarifaire</CardTitle>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cn(
                "text-xs h-9 border-[#272727] bg-[#161616] hover:bg-[#222] transition-all duration-200",
                "hover:scale-105 focus:ring-1 focus:ring-primary/30 rounded-md"
              )}
            >
              <RefreshCw className={cn(
                "mr-2 h-3.5 w-3.5 transition-transform",
                isRefreshing && "animate-spin"
              )} />
              Rafraîchir
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetSimulation}
              disabled={isResetting}
              className={cn(
                "text-xs h-9 border-[#272727] bg-[#161616] hover:bg-[#222] transition-all duration-200",
                "hover:scale-105 focus:ring-1 focus:ring-primary/30 rounded-md"
              )}
            >
              <RotateCw className={cn(
                "mr-2 h-3.5 w-3.5 transition-transform",
                isResetting && "animate-spin"
              )} />
              Réinitialiser
            </Button>
            
            {analysisMode === 'ai' ? (
              <UpdatePricesButton 
                productPrices={productPrices}
                selectedSKUs={selectedSKUs}
                analysisItems={analysisItems}
              />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-[130px]">
                      {/* Empty div to maintain spacing/layout */}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1A1A1A] border-[#2A2A2A] text-xs rounded-md py-1.5">
                    <p>Disponible en mode Analyse AI uniquement</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="rounded-md border border-[#272727] overflow-hidden m-4 shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-300">Chargement des données...</span>
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
              showQuantityInputs={showSimulationSummary}
              simulationTotal={simulationTotal}
            />
          )}
        </div>
        
        {showSimulationSummary && (
          <div className="m-4 mt-6">
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
        )}
      </CardContent>
    </Card>
  );
};

export default PricingGrid;
