
import React from 'react';
import BudgetLoadingState from './budget/BudgetLoadingState';
import BudgetSimulationLayout from './simulation/BudgetSimulationLayout';
import BudgetSidePanel from './budget/BudgetSidePanel';
import SimulationTabsContainer from './simulation/SimulationTabsContainer';
import { useBudgetSimulation } from './simulation/useBudgetSimulation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BudgetSimulation: React.FC = () => {
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
    totalBudget,
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

  // Count configured products
  const configuredProductCount = Object.keys(selectedSKUs).length;
  const totalProductCount = products.length;

  // If loading state
  if (isPricesLoading || isBudgetLoading) {
    return <BudgetLoadingState />;
  }

  return (
    <div className="space-y-4">
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
            groupedAnalysisProducts={groupedAnalysisProducts}
            simulationTotal={simulationTotal}
            onAddSKU={handleAddSKU}
            onQuantityChange={handleQuantityChange}
            onRemoveSKU={handleRemoveSKU}
            calculateSKUTotal={calculateSKUTotal}
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
      />
    </div>
  );
};

export default BudgetSimulation;
