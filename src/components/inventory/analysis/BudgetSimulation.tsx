
import React, { useState, useEffect } from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import BudgetMetrics from './budget/BudgetMetrics';
import BudgetSettingsPanel from './BudgetSettingsPanel';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useSimulationState } from '@/hooks/useSimulationState';
import { useSimulationSKUs } from '@/hooks/useSimulationSKUs';
import BudgetNotesActions from './budget/BudgetNotesActions';
import SimulationTable from './simulation/SimulationTable';
import OrderSimulationTable from './OrderSimulationTable';
import PricingGrid from './PricingGrid';
import RefreshPricesButton from './simulation/RefreshPricesButton';
import { Loader2 } from 'lucide-react';
import BudgetSummary from './BudgetSummary';
import BudgetLoadingState from './budget/BudgetLoadingState';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const { products } = useProducts('analysis');
  const { analysisItems } = useAnalysisItems();
  const { productPrices, isLoading: isPricesLoading, refetch } = useProductPrices();
  const { budgetSettings, isLoading: isBudgetLoading } = useBudgetSettings();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('order');
  
  const totalBudget = budgetSettings?.total_budget || 0;
  const depositPercentage = budgetSettings?.deposit_percentage || 50;
  
  // Calculate metrics based on simulationTotal
  const depositAmount = (simulationTotal * depositPercentage) / 100;
  const remainingBudget = totalBudget - depositAmount;
  const budgetPercentage = totalBudget > 0 ? (depositAmount / totalBudget) * 100 : 0;
  
  // Prepare products for simulation
  const groupedAnalysisProducts = products.reduce((acc, product) => {
    // Extract category from SKU (e.g., "COLLAGENE-LOTUS" => "COLLAGENE")
    const skuParts = product.SKU.split('-');
    const category = skuParts[0];
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push({
      id: product.id,
      SKU: product.SKU,
      productName: product.product_name
    });
    
    return acc;
  }, {} as Record<string, Array<{ id: string, SKU: string, productName: string | null }>>);
  
  // Hook for simulation state
  const {
    selectedSKUs,
    setSelectedSKUs,
    calculateSKUTotal
  } = useSimulationState();
  
  // Hook for SKU operations
  const {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange
  } = useSimulationSKUs(selectedSKUs, setSelectedSKUs, productPrices);
  
  // Handle quantity changes in the OrderSimulationTable
  const handleOrderQuantityChange = (productId: string, quantity: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  // Update SelectedSKUs whenever analysisItems changes
  useEffect(() => {
    if (analysisItems.length > 0 && products.length > 0 && productPrices.length > 0) {
      // Logic to pre-populate selectedSKUs based on analysisItems
    }
  }, [analysisItems, products, productPrices]);

  // Loading state
  if (isBudgetLoading || isPricesLoading) {
    return <BudgetLoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="border border-[#272727] bg-[#131313]">
            <Tabs 
              defaultValue="order" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center px-4 pt-4">
                <TabsList className="bg-[#1A1A1A]">
                  <TabsTrigger value="order">Commande</TabsTrigger>
                  <TabsTrigger value="simulation">Simulation</TabsTrigger>
                  <TabsTrigger value="prices">Grille Tarifaire</TabsTrigger>
                </TabsList>
                
                <RefreshPricesButton 
                  onRefresh={() => refetch()} 
                  isLoading={isPricesLoading}
                />
              </div>
              
              <CardContent className="pt-4 pb-2">
                <TabsContent value="order" className="m-0">
                  <OrderSimulationTable 
                    selectedQuantities={selectedQuantities}
                    onQuantityChange={handleOrderQuantityChange}
                    onSimulationTotalChange={setSimulationTotal}
                  />
                </TabsContent>
                
                <TabsContent value="simulation" className="m-0">
                  <SimulationTable 
                    productPrices={productPrices}
                    isLoading={isPricesLoading}
                    quantityOptions={quantityOptions}
                    selectedSKUs={selectedSKUs}
                    groupedAnalysisProducts={groupedAnalysisProducts}
                    simulationTotal={simulationTotal}
                    onAddSKU={handleAddSKU}
                    onQuantityChange={handleQuantityChange}
                    onRemoveSKU={handleRemoveSKU}
                    calculateSKUTotal={calculateSKUTotal}
                  />
                </TabsContent>
                
                <TabsContent value="prices" className="m-0">
                  <PricingGrid />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          
          <BudgetNotesActions 
            notes={budgetSettings?.notes} 
            className="mt-4"
          />
        </div>
        
        <div className="space-y-4">
          <BudgetSummary
            productCount={products.length}
            totalBudget={totalBudget}
            configuredProductCount={Object.keys(selectedQuantities).length}
            totalProductCount={products.length}
            onCreateOrder={onCreateOrder}
            isLoading={isBudgetLoading || isPricesLoading}
            totalOrderAmount={simulationTotal}
            depositAmount={depositAmount}
            budgetPercentage={budgetPercentage}
            budgetAmount={totalBudget}
          />
          
          <Card className="border border-[#272727] bg-[#161616]">
            <CardContent className="p-4">
              <BudgetMetrics 
                totalOrderAmount={simulationTotal}
                depositPercentage={depositPercentage}
                totalBudget={totalBudget}
                depositAmount={depositAmount}
                remainingBudget={remainingBudget}
                budgetPercentage={budgetPercentage}
              />
            </CardContent>
          </Card>
          
          <BudgetSettingsPanel />
        </div>
      </div>
    </div>
  );
};

export default BudgetSimulation;
