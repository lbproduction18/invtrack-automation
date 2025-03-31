
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
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

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
  
  // Create placeholders for order simulation tab functionality
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, QuantityOption>>({});
  
  const handleOrderQuantityChange = (productId: string, quantity: QuantityOption) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  const handleSimulationTotalChange = (total: number) => {
    // This function would be used when calculating totals from the order tab
    console.log("Order simulation total changed:", total);
  };
  
  // Refresh data when needed
  const handleRefresh = async (): Promise<void> => {
    await refetchPrices();
    await refetchAnalysis();
    return Promise.resolve();
  };

  // Wrapper for calculateSKUTotal to match the expected signature in SimulationTabsContainer
  const calculateSKUTotalWrapper = (productName: string, sku: { 
    productId: string; 
    SKU: string; 
    productName: string | null; 
    quantity: QuantityOption; 
    price: number 
  }): number => {
    return calculateSKUTotal(sku);
  };

  // Wrapper for handleAddSKU to match expected signature
  const handleAddSKUWrapper = (
    productCategory: string,
    productId: string,
    SKU: string,
    productName: string | null
  ): void => {
    handleAddSKU(productCategory, { id: productId, SKU, productName });
  };

  // Wrapper for handleQuantityChange to match expected signature
  const handleQuantityChangeWrapper = (
    productCategory: string,
    productId: string,
    quantity: QuantityOption
  ): void => {
    // Find the index of the SKU with this productId in the selectedSKUs array
    const skuIndex = selectedSKUs[productCategory]?.findIndex(sku => sku.productId === productId) ?? -1;
    if (skuIndex !== -1) {
      handleQuantityChange(productCategory, skuIndex, quantity);
    }
  };

  // Wrapper for handleRemoveSKU to match expected signature
  const handleRemoveSKUWrapper = (
    productCategory: string,
    productId: string
  ): void => {
    // Find the index of the SKU with this productId in the selectedSKUs array
    const skuIndex = selectedSKUs[productCategory]?.findIndex(sku => sku.productId === productId) ?? -1;
    if (skuIndex !== -1) {
      handleRemoveSKU(productCategory, skuIndex);
    }
  };

  // Ensure we sync any missing SKU data with Supabase
  useEffect(() => {
    // Find SKUs in the UI that might not be synced with the database
    for (const [productName, skus] of Object.entries(selectedSKUs)) {
      for (const sku of skus) {
        const analysisItem = analysisItems.find(item => item.product_id === sku.productId);
        
        if (analysisItem && (!analysisItem.sku_code || !analysisItem.sku_label)) {
          console.log(`Syncing missing SKU data for product ${sku.productId}`);
          // Update the analysis item with the SKU data
          const { updateAnalysisItem } = useAnalysisItems();
          updateAnalysisItem.mutate({
            id: analysisItem.id,
            data: {
              sku_code: sku.SKU,
              sku_label: sku.productName || ''
            }
          });
        }
      }
    }
  }, [selectedSKUs, analysisItems]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <SimulationTabsContainer
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isPricesLoading={isLoadingPrices}
          onRefresh={handleRefresh}
          productPrices={productPrices}
          quantityOptions={quantityOptions}
          selectedSKUs={selectedSKUs}
          groupedAnalysisProducts={groupedAnalysisProducts}
          simulationTotal={simulationTotal}
          onAddSKU={handleAddSKUWrapper}
          onQuantityChange={handleQuantityChangeWrapper}
          onRemoveSKU={handleRemoveSKUWrapper}
          calculateSKUTotal={calculateSKUTotalWrapper}
          selectedQuantities={selectedQuantities}
          onOrderQuantityChange={handleOrderQuantityChange}
          onSimulationTotalChange={handleSimulationTotalChange}
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
          productCount={Object.keys(selectedSKUs).length}
          totalBudget={300000} // Default budget, this could be fetched from settings
          configuredProductCount={Object.values(selectedSKUs).flat().length}
          totalProductCount={products.length}
          onCreateOrder={() => console.log("Create order")}
          isLoading={isLoadingPrices}
          simulationTotal={simulationTotal}
          depositAmount={simulationTotal * 0.5} // 50% deposit by default
          depositPercentage={50}
          budgetPercentage={simulationTotal / 300000 * 100}
          remainingBudget={300000 - simulationTotal}
        />
      </div>
    </div>
  );
};

export default BudgetSimulation;
