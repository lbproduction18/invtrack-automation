
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
import { Loader2, RefreshCw, RotateCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetSimulation } from '../simulation/useBudgetSimulation';
import { formatTotalPrice } from './PriceFormatter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BudgetSlider from './components/BudgetSlider';

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
    allProductsHavePrices,
  } = usePricingCalculation(productPrices);
  
  const isLoading = isPricesLoading || isProductsLoading || isAnalysisLoading;
  const [isResetting, setIsResetting] = useState(false);

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

  const handleLaunchAIAnalysis = () => {
    console.log("Launching AI analysis...");
    // Implement your AI analysis logic here
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
              onClick={handleRefresh}
              className="text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222]"
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Rafraîchir
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetSimulation}
              disabled={isResetting}
              className="text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222]"
            >
              {isResetting ? (
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <RotateCw className="mr-2 h-3 w-3" />
              )}
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
                  <TooltipContent>
                    <p>Disponible en mode Analyse AI uniquement</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {allProductsHavePrices ? (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <Button 
              variant="default" 
              size="lg" 
              onClick={handleLaunchAIAnalysis}
              className="py-3 px-6 text-base font-medium"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Lancer l'analyse AI
            </Button>
            <p className="mt-3 text-sm text-gray-400">
              Tous les prix sont définis. Vous pouvez maintenant lancer l'analyse automatique.
            </p>
          </div>
        ) : (
          <>
            {/* Budget Slider - Only visible in manual mode */}
            {analysisMode === 'manual' && (
              <div className="sticky top-0 z-10 mx-4 mt-4 p-2 rounded-md border border-[#272727] bg-[#161616]">
                <BudgetSlider simulationTotal={simulationTotal} />
              </div>
            )}
          
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
                  showQuantityInputs={analysisMode === 'manual'}
                  simulationTotal={analysisMode === 'manual' ? simulationTotal : 0}
                  analysisMode={analysisMode}
                />
              )}
            </div>
            
            {/* Only show simulation summary in manual mode */}
            {showSimulationSummary && analysisMode === 'manual' && (
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingGrid;
