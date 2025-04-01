
import React from 'react';
import { Loader2 } from 'lucide-react';
import PriceTable from '../PriceTable';
import SimulationSummary from '../SimulationSummary';
import LoadingIndicator from './LoadingIndicator';
import AINoteDisplay from './AINoteDisplay';

interface PricingGridContentProps {
  analysisMode: 'manual' | 'ai';
  isLoading: boolean;
  allProductsHaveSKUs: boolean;
  simulationTotal: number;
  showSimulationSummary: boolean;
  productPrices: any[];
  selectedSKUs: string[];
  quantities: Record<string, string>;
  calculatedPrices: Record<string, number>;
  analysisProductSKUs: any[];
  analysisItems: any[];
  products: any[];
  isResetting: boolean;
  handleSKUSelect: (sku: string) => void;
  handleSKURemove: (sku: string) => void;
  handleQuantityChange: (sku: string, quantity: string) => void;
  handleLaunchAIAnalysis: () => void;
  handleResetSimulation: () => void;
  getTotalForProduct: (sku: string) => number;
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
  if (isLoading || isResetting) {
    return <LoadingIndicator message={isResetting ? "Réinitialisation..." : "Chargement des données..."} />;
  }

  // Afficher le composant AINoteDisplay lorsque l'on est en mode AI
  return (
    <div className="space-y-4">
      {analysisMode === 'ai' && <AINoteDisplay />}
      
      <div className="rounded-md border border-[#272727] overflow-hidden mt-4">
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
        />
      </div>
      
      {showSimulationSummary && (
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
    </div>
  );
};

export default PricingGridContent;
