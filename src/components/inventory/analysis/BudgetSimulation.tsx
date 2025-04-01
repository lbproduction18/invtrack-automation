
import React from 'react';
import { BudgetLoadingState } from './budget/BudgetLoadingState';
import BudgetSimulationLayout from './simulation/BudgetSimulationLayout';
import BudgetSidePanel from './budget/BudgetSidePanel';
import SimulationTabsContainer from './simulation/SimulationTabsContainer';
import { useBudgetSimulation } from './simulation/useBudgetSimulation';

import { SimulationMetadata } from '@/types/simulationMetadata';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Add this to the props interface
interface BudgetSimulationProps {
  simulation?: SimulationMetadata | null;
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

  // Override the total budget with the simulation's budget if provided
  const totalBudget = simulation?.budget_max || defaultTotalBudget;
  
  // Count configured products
  const configuredProductCount = Object.keys(selectedSKUs).length;
  const totalProductCount = products.length;

  // If isPending loading state
  if (isPricesLoading || isBudgetLoading) {
    return <BudgetLoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Add a back button if onBack is provided */}
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
      
      {/* Show simulation name if provided */}
      {simulation && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            {simulation.simulation_name || 'Simulation sans nom'}
          </h2>
          {simulation.ai_notes && (
            <p className="text-gray-400 mt-1">
              {simulation.ai_notes}
            </p>
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
        notes={simulation?.ai_notes || null}
      />
    </div>
  );
};

export default BudgetSimulation;
