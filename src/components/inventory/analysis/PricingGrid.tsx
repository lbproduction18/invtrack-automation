
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProductPrices } from '@/hooks/useProductPrices';
import { useProducts } from '@/hooks/useProducts';
import { usePricingCalculation } from './pricing/usePricingCalculation';
import PriceTable from './pricing/PriceTable';
import TotalSummary from './pricing/TotalSummary';
import SelectedSKUsList from './pricing/SelectedSKUsList';
import UpdatePricesButton from './pricing/UpdatePricesButton';
import RefreshPriceGridButton from './pricing/RefreshPriceGridButton';
import { Loader2 } from 'lucide-react';
import { formatTotalPrice } from './pricing/PriceFormatter';

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading: isPricesLoading } = useProductPrices();
  const { products, isLoading: isProductsLoading } = useProducts('analysis');
  
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
  
  const isLoading = isPricesLoading || isProductsLoading;

  // Safely get all SKUs from selectedSKUs
  const getAllSelectedSKUs = () => {
    return Object.values(selectedSKUs).flat();
  };

  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <CardHeader className="px-4 py-3 border-b border-[#272727]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Grille Tarifaire</CardTitle>
          <div className="flex space-x-2">
            <RefreshPriceGridButton />
            <UpdatePricesButton 
              productPrices={productPrices}
              selectedSKUs={selectedSKUs}
              analysisItems={[]}
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
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SelectedSKUsList
              productId=""
              skus={getAllSelectedSKUs()}
              quantities={{}}
              calculatedPrices={{}}
              onQuantityChange={() => {}}
              onRemoveSKU={() => {}}
            />
          </div>
          <div>
            <TotalSummary simulationTotal={simulationTotal} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingGrid;
