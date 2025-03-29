import React from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { usePricingCalculation } from './pricing/usePricingCalculation';
import { formatTotalPrice } from './pricing/PriceFormatter';
import PriceTable from './pricing/PriceTable';
import TotalSummary from './pricing/TotalSummary';
import SimulationSummary from './pricing/SimulationSummary';

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading } = useProductPrices();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('all');
  
  const {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    getQuantityForSKU,
    getPriceForSKU,
    handleSKUSelect,
    handleQuantityChange
  } = usePricingCalculation(productPrices);

  const getAnalysisProductSKUs = () => {
    return products.filter(product => 
      analysisItems.some(item => item.product_id === product.id)
    ).map(product => ({
      id: product.id,
      SKU: product.SKU
    }));
  };

  const analysisProductSKUs = getAnalysisProductSKUs();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des prix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <ScrollArea className="h-[400px]">
          <PriceTable
            productPrices={productPrices}
            isLoading={isLoading}
            selectedSKUs={selectedSKUs}
            quantities={quantities}
            calculatedPrices={calculatedPrices}
            analysisProductSKUs={analysisProductSKUs}
            handleSKUSelect={handleSKUSelect}
            handleQuantityChange={handleQuantityChange}
            formatTotalPrice={formatTotalPrice}
          />
        </ScrollArea>
      </div>
      
      <TotalSummary simulationTotal={simulationTotal} />
      
      <SimulationSummary
        analysisItems={analysisItems}
        products={products}
        simulationTotal={simulationTotal}
        getQuantityForSKU={getQuantityForSKU}
        getPriceForSKU={getPriceForSKU}
      />
    </div>
  );
};

export default PricingGrid;
