
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { useProductPrices } from '@/hooks/useProductPrices'; 
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useSimulationState } from '@/hooks/useSimulationState';
import { useSimulationSKUs } from '@/hooks/useSimulationSKUs';
import SimulationSummary from './pricing/SimulationSummary';
import SimulationTabsContainer from './simulation/SimulationTabsContainer';
import BudgetSidePanel from './budget/BudgetSidePanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type QuantityOption } from './AnalysisContent';

const BudgetSimulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulation');
  
  // Fetch data for products, prices, and analysis items
  const { products } = useProducts('all');
  const { productPrices, isLoading: isLoadingPrices, refetch: refetchPrices } = useProductPrices();
  const { analysisItems, refetch: refetchAnalysis } = useAnalysisItems();
  
  // Simulation state management
  const { 
    simulationTotal, 
    selectedSKUs, 
    setSelectedSKUs,
    calculateSKUTotal 
  } = useSimulationState();
  
  // Custom hook for handling SKU selection and quantity updates
  const { 
    quantityOptions,
    handleAddSKU, 
    handleRemoveSKU,
    handleQuantityChange
  } = useSimulationSKUs(selectedSKUs, setSelectedSKUs, productPrices);
  
  // Group products by their category for the simulation
  const groupAnalysisProductsBySKU = (): Record<string, Array<{ id: string, SKU: string, productName: string | null }>> => {
    const products_with_analysis = products.filter(product => 
      analysisItems.some(item => item.product_id === product.id)
    );
    
    return products_with_analysis.reduce((acc, product) => {
      // Extract the product type from the SKU (e.g., "COLLAGENE" from "COLLAGENE-LOTUS")
      const skuParts = product.SKU.split('-');
      const productType = skuParts[0];
      
      // Initialize the array if it doesn't exist yet
      if (!acc[productType]) {
        acc[productType] = [];
      }
      
      // Add this product to the group
      acc[productType].push({ 
        id: product.id,
        SKU: product.SKU,
        productName: product.product_name
      });
      
      return acc;
    }, {} as Record<string, Array<{ id: string, SKU: string, productName: string | null }>>);
  };
  
  const groupedAnalysisProducts = groupAnalysisProductsBySKU();
  
  // Refresh data when needed
  const handleRefresh = async () => {
    await refetchPrices();
    await refetchAnalysis();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <SimulationTabsContainer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          productPrices={productPrices}
          isLoadingPrices={isLoadingPrices}
          groupedAnalysisProducts={groupedAnalysisProducts}
          quantityOptions={quantityOptions}
          selectedSKUs={selectedSKUs}
          handleAddSKU={handleAddSKU}
          handleQuantityChange={handleQuantityChange}
          handleRemoveSKU={handleRemoveSKU}
          onRefresh={handleRefresh}
          simulationTotal={simulationTotal}
          calculateSKUTotal={calculateSKUTotal}
        />
        
        <Card className="bg-[#161616] border-[#272727]">
          <CardContent className="p-0">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="bg-[#121212] w-full rounded-none border-b border-[#272727]">
                <TabsTrigger 
                  value="summary"
                  className="rounded-none data-[state=active]:bg-[#161616] data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                >
                  Résumé de la simulation
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="p-4">
                <SimulationSummary 
                  analysisItems={analysisItems}
                  products={products}
                  simulationTotal={simulationTotal}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <BudgetSidePanel
          totalOrderAmount={simulationTotal}
        />
      </div>
    </div>
  );
};

export default BudgetSimulation;
