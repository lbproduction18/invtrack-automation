
import React from 'react';
import { Loader2 } from "lucide-react";
import PriceTable from '../PriceTable';
import BudgetSlider from './BudgetSlider';
import SimulationSummary from '../SimulationSummary';
import { ProductPrice } from '@/hooks/useProductPrices';
import { AnalysisItem } from '@/hooks/useAnalysisItems';
import { Product } from '@/types/product';
import { formatTotalPrice } from '../PriceFormatter';

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
  handleSKUSelect: (productId: string, sku: string) => void;
  handleSKURemove: (productId: string, sku: string) => void;
  handleQuantityChange: (productId: string, sku: string, quantityValue: string) => void;
  handleLaunchAIAnalysis: () => void;
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
  handleSKUSelect,
  handleSKURemove,
  handleQuantityChange,
  handleLaunchAIAnalysis,
  getTotalForProduct,
  getUnitPriceForSKU
}) => {
  // Check if any SKUs are selected to determine if we should show the AI analysis button
  const hasSelectedSKUs = Object.values(selectedSKUs).some(skuArray => skuArray.length > 0);
  
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
