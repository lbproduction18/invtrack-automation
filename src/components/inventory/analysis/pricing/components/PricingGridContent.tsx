
import React from 'react';
import { Loader2, RotateCw } from "lucide-react";
import PriceTable from '../PriceTable';
import BudgetSlider from './BudgetSlider';
import SimulationSummary from '../SimulationSummary';
import { Button } from '@/components/ui/button';
import { ProductPrice } from '@/hooks/useProductPrices';
import { AnalysisItem } from '@/hooks/useAnalysisItems';
import { Product } from '@/types/product';
import { formatTotalPrice } from '../PriceFormatter';
import UpdatePricesButton from '../UpdatePricesButton';

interface PricingGridContentProps {
  analysisMode: 'manual' | 'ai';
  isLoading: boolean;
  allProductsHaveSKUs: boolean;
  simulationTotal: number;
  showSimulationSummary: boolean;
  productPrices: ProductPrice[];
  selectedSKUs: Record<string, string[]>;
  quantities: Record<string, Record<string, string>>;
  calculatedPrices: Record<string, Record<string, number | string>>;
  analysisProductSKUs: Array<{ id: string, SKU: string }>;
  analysisItems: AnalysisItem[];
  products: Product[];
  isResetting: boolean;
  handleSKUSelect: (productId: string, sku: string) => void;
  handleSKURemove: (productId: string, sku: string) => void;
  handleQuantityChange: (productId: string, sku: string, quantityValue: string) => void;
  handleLaunchAIAnalysis: () => void;
  handleResetSimulation: () => void;
  getTotalForProduct: (productId: string) => number;
  getUnitPriceForSKU: (productId: string, sku: string, quantity?: string) => number;
}

const PricingGridContent: React.FC<PricingGridContentProps> = ({
  analysisMode,
  isLoading,
  allProductsHaveSKUs,
  simulationTotal,
  showSimulationSummary,
  productPrices,
  selectedSKUs,
  quantities,
  calculatedPrices,
  analysisProductSKUs,
  analysisItems,
  products,
  isResetting,
  handleSKUSelect,
  handleSKURemove,
  handleQuantityChange,
  handleLaunchAIAnalysis,
  handleResetSimulation,
  getTotalForProduct,
  getUnitPriceForSKU
}) => {
  return (
    <>
      {/* Budget Slider - Only visible in manual mode */}
      {analysisMode === 'manual' && (
        <div className="sticky top-0 z-10 mx-4 mt-4 p-2 rounded-md border border-[#272727] bg-[#161616]">
          <BudgetSlider simulationTotal={simulationTotal} />
        </div>
      )}
      
      {/* Price table - Always show in manual mode, or in AI mode when not all products have SKUs */}
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
            analysisItems={analysisItems}
          />
        )}
      </div>
      
      {/* Buttons container - Always visible but content changes based on mode */}
      <div className="mt-6 flex justify-center items-center gap-4">
        {/* For AI mode, we show both buttons side by side */}
        {analysisMode === 'ai' && (
          <>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleResetSimulation}
              disabled={isResetting}
              className="font-medium px-6 py-2 min-w-28"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              {isResetting ? 'Réinitialisation...' : 'Réinitialiser'}
            </Button>
            <UpdatePricesButton 
              productPrices={productPrices}
              selectedSKUs={selectedSKUs}
              analysisItems={analysisItems}
              className="min-w-40"
            />
          </>
        )}
        
        {/* For manual mode, we only show the UpdatePricesButton here */}
        {analysisMode === 'manual' && (
          <UpdatePricesButton 
            productPrices={productPrices}
            selectedSKUs={selectedSKUs}
            analysisItems={analysisItems}
            className="min-w-40"
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
  );
};

export default PricingGridContent;
