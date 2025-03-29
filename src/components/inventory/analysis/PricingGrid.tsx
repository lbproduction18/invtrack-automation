
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductPrices } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { usePricingCalculation } from './pricing/usePricingCalculation';
import PriceTable from './pricing/PriceTable';
import SimulationSummary from './pricing/SimulationSummary';
import TotalSummary from './pricing/TotalSummary';
import SelectedSKUsList from './pricing/SelectedSKUsList';
import { Loader2 } from 'lucide-react';
import { formatTotalPrice } from './pricing/PriceFormatter';

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading: isPricesLoading } = useProductPrices();
  const { analysisItems, isLoading: isAnalysisLoading, refetch: refetchAnalysisItems } = useAnalysisItems();
  const { products, isLoading: isProductsLoading } = useProducts('analysis');
  const [activeTab, setActiveTab] = useState<string>('pricing');
  
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
  
  const isLoading = isPricesLoading || isAnalysisLoading || isProductsLoading;

  // Refetch analysis items when switching to the simulation tab to ensure latest data
  useEffect(() => {
    if (activeTab === 'simulation') {
      refetchAnalysisItems();
    }
  }, [activeTab, refetchAnalysisItems]);

  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <CardHeader className="px-4 py-3 border-b border-[#272727]">
        <CardTitle className="text-sm font-medium">Grille Tarifaire et Simulation</CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="bg-[#1A1A1A]">
            <TabsTrigger value="pricing">Grille Tarifaire</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-0">
          <TabsContent value="pricing" className="mt-0">
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
                  skus={Object.values(selectedSKUs).flat()}
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
          </TabsContent>
          
          <TabsContent value="simulation" className="mt-0 p-4">
            <SimulationSummary 
              analysisItems={analysisItems}
              products={products}
              simulationTotal={simulationTotal}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default PricingGrid;
