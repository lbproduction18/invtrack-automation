import React from 'react';
import { useBudgetSimulation } from './simulation/useBudgetSimulation';
import BudgetSimulationLayout from './simulation/BudgetSimulationLayout';
import SimulationTabsContainer from './simulation/SimulationTabsContainer';
import BudgetSidePanel from './budget/BudgetSidePanel';
import BudgetLoadingState from './budget/BudgetLoadingState';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const {
    products,
    budgetSettings,
    isPricesLoading,
    isBudgetLoading,
    selectedQuantities,
    simulationTotal,
    setSimulationTotal,
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
    calculateSKUTotal
  } = useBudgetSimulation(onCreateOrder);

  // Loading state
  if (isBudgetLoading || isPricesLoading) {
    return <BudgetLoadingState />;
  }

  const tabsContent = (
    <SimulationTabsContainer
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isPricesLoading={isPricesLoading}
      onRefresh={handleRefresh} // This should now be properly typed
      productPrices={productPrices}
      quantityOptions={quantityOptions}
      selectedSKUs={selectedSKUs}
      groupedAnalysisProducts={groupedAnalysisProducts}
      simulationTotal={simulationTotal}
      onAddSKU={handleAddSKU}
      onQuantityChange={handleQuantityChange}
      onRemoveSKU={handleRemoveSKU}
      calculateSKUTotal={calculateSKUTotal}
      selectedQuantities={selectedQuantities}
      onOrderQuantityChange={handleOrderQuantityChange}
      onSimulationTotalChange={setSimulationTotal}
    />
  );

  const sidePanel = (
    <BudgetSidePanel
      productCount={products.length}
      totalBudget={totalBudget}
      configuredProductCount={Object.keys(selectedQuantities).length}
      totalProductCount={products.length}
      onCreateOrder={onCreateOrder}
      isLoading={isBudgetLoading || isPricesLoading}
      simulationTotal={simulationTotal}
      depositAmount={depositAmount}
      depositPercentage={depositPercentage}
      budgetPercentage={budgetPercentage}
      remainingBudget={remainingBudget}
    />
  );

  return (
    <BudgetSimulationLayout
      tabsContent={tabsContent}
      sidePanel={sidePanel}
      notes={budgetSettings?.notes}
    />
  );
};

export default BudgetSimulation;
