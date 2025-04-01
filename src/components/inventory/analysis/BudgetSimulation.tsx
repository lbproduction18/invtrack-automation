
import React, { useEffect } from 'react';
import BudgetLoadingState from './budget/BudgetLoadingState';
import BudgetSimulationLayout from './simulation/BudgetSimulationLayout';
import BudgetSidePanel from './budget/BudgetSidePanel';
import SimulationTabsContainer from './simulation/SimulationTabsContainer';
import { useBudgetSimulation } from './simulation/useBudgetSimulation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { QuantityOption } from '@/components/inventory/AnalysisContent';

interface BudgetSimulationProps {
  simulation?: {
    simulation_id?: string;
    simulation_name?: string;
    budget_max?: number;
    ai_notes?: string;
  };
  onBack?: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ simulation, onBack }) => {
  // Use budget max from simulation if provided
  const initialBudget = simulation?.budget_max || 300000;
  
  // Use the useBudgetSimulation hook
  const {
    products,
    budgetSettings,
    isPricesLoading,
    isBudgetLoading,
    selectedQuantities,
    simulationTotal,
    activeTab,
    setActiveTab,
    totalBudget: defaultTotalBudget,
    depositPercentage,
    depositAmount,
    remainingBudget,
    budgetPercentage,
    groupedAnalysisProducts,
    selectedSKUs,
    productPrices,
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange,
    handleOrderQuantityChange,
    handleRefresh,
    calculateSKUTotal,
    getUnitPriceForSKU
  } = useBudgetSimulation(() => {
    console.log("Create order callback");
  });

  // Log for debugging
  useEffect(() => {
    console.log("BudgetSimulation rendered with groupedAnalysisProducts:", groupedAnalysisProducts);
  }, [groupedAnalysisProducts]);

  // Override the total budget with the simulation's budget if provided
  const totalBudget = simulation?.budget_max || defaultTotalBudget;

  // Count configured products
  const configuredProductCount = Object.keys(selectedSKUs).length;
  const totalProductCount = products.length;

  // If loading state
  if (isPricesLoading || isBudgetLoading) {
    return <BudgetLoadingState />;
  }

  // Create wrapper functions to adapt to the expected types in SimulationTabsContainer
  const handleAddSKUWrapper = (productCategory: string, productId: string, SKU: string, productName: string) => {
    handleAddSKU(productCategory, { id: productId, SKU, productName });
  };

  const handleQuantityChangeWrapper = (productCategory: string, productId: string, quantity: QuantityOption) => {
    // Find the index of the selected SKU
    const skuList = selectedSKUs[productCategory] || [];
    const skuIndex = skuList.findIndex(sku => sku.productId === productId);
    if (skuIndex !== -1) {
      handleQuantityChange(productCategory, skuIndex, quantity);
    }
  };

  const handleRemoveSKUWrapper = (productCategory: string, productId: string) => {
    // Find the index of the selected SKU
    const skuList = selectedSKUs[productCategory] || [];
    const skuIndex = skuList.findIndex(sku => sku.productId === productId);
    if (skuIndex !== -1) {
      handleRemoveSKU(productCategory, skuIndex);
    }
  };

  const calculateSKUTotalWrapper = (productName: string, sku: { productId: string; SKU: string; productName: string; quantity: QuantityOption; price: number; }) => {
    return sku.quantity * sku.price;
  };
  
  // Transform the grouped products to the expected format
  const transformedGroupedProducts: Record<string, { id: string; SKU: string; productName: string; }[]> = {};
  
  // Safely handle groupedAnalysisProducts, ensuring it's always treated as an array
  // and protecting against null/undefined values
  try {
    // First check if it's defined
    if (groupedAnalysisProducts) {
      // Convert to array if it's not already
      const analysisProductsArray = Array.isArray(groupedAnalysisProducts) ? 
        groupedAnalysisProducts : [groupedAnalysisProducts];
      
      // Filter out any null/undefined entries and ensure all required props have fallbacks
      if (analysisProductsArray.length > 0) {
        transformedGroupedProducts["analysis"] = analysisProductsArray
          .filter(product => product !== null && product !== undefined)
          .map(product => ({
            id: product.id || "",
            SKU: product.sku || "",
            productName: product.product_name || "Unknown Product"
          }));
        
        console.log("Transformed analysis products:", transformedGroupedProducts["analysis"]);
      }
    }
  } catch (error) {
    console.error("Error transforming groupedAnalysisProducts:", error);
    // Provide fallback empty array for the analysis category
    transformedGroupedProducts["analysis"] = [];
  }

  return (
    <div className="space-y-4">
      {onBack && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux simulations
        </Button>
      )}
      
      {simulation && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            {simulation.simulation_name || 'Simulation sans nom'}
          </h2>
          {simulation.ai_notes && (
            <p className="text-gray-400 mt-1">{simulation.ai_notes}</p>
          )}
        </div>
      )}
      
      <BudgetSimulationLayout 
        tabsContent={
          <SimulationTabsContainer
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isPricesLoading={isPricesLoading}
            productPrices={productPrices}
            selectedQuantities={selectedQuantities}
            onOrderQuantityChange={handleOrderQuantityChange}
            onSimulationTotalChange={() => {}}
            onRefresh={handleRefresh}
            quantityOptions={quantityOptions}
            selectedSKUs={selectedSKUs}
            groupedAnalysisProducts={transformedGroupedProducts}
            simulationTotal={simulationTotal}
            onAddSKU={handleAddSKUWrapper}
            onQuantityChange={handleQuantityChangeWrapper}
            onRemoveSKU={handleRemoveSKUWrapper}
            calculateSKUTotal={calculateSKUTotalWrapper}
          />
        }
        sidePanel={
          <BudgetSidePanel
            productCount={products.length}
            totalBudget={totalBudget}
            configuredProductCount={configuredProductCount}
            totalProductCount={totalProductCount}
            onCreateOrder={() => console.log("Creating order...")}
            isLoading={isPricesLoading || isBudgetLoading}
            simulationTotal={simulationTotal}
            depositAmount={depositAmount}
            depositPercentage={depositPercentage}
            budgetPercentage={budgetPercentage}
            remainingBudget={remainingBudget}
          />
        }
        notes={simulation?.ai_notes || null}
      />
    </div>
  );
};

export default BudgetSimulation;
