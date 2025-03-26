
import React, { useState, useEffect } from 'react';
import OrderSimulationTable from './OrderSimulationTable';
import BudgetSettingsPanel from './BudgetSettingsPanel';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  // Handle quantity change for a product
  const handleQuantityChange = (productKey: string, quantity: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productKey]: quantity
    }));
  };

  // Update simulation total
  const handleSimulationTotalChange = (total: number) => {
    setSimulationTotal(total);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Simulation de Commande</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OrderSimulationTable
            selectedQuantities={selectedQuantities}
            onQuantityChange={handleQuantityChange}
            onSimulationTotalChange={handleSimulationTotalChange}
          />
        </div>
        
        <div className="lg:col-span-1 lg:sticky lg:top-4 self-start">
          <BudgetSettingsPanel
            totalOrderAmount={simulationTotal}
            onCreateOrder={onCreateOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetSimulation;
