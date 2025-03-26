
import React, { useState, useEffect } from 'react';
import OrderSimulationTable from './OrderSimulationTable';
import BudgetSettingsPanel from './BudgetSettingsPanel';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, QuantityOption>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  // Handle quantity change for a product
  const handleQuantityChange = (productKey: string, quantity: QuantityOption) => {
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
      
      <div className="mb-6">
        <BudgetSettingsPanel
          totalOrderAmount={simulationTotal}
          onCreateOrder={onCreateOrder}
        />
      </div>
      
      <div>
        <OrderSimulationTable
          selectedQuantities={selectedQuantities}
          onQuantityChange={handleQuantityChange}
          onSimulationTotalChange={handleSimulationTotalChange}
        />
      </div>
    </div>
  );
};

export default BudgetSimulation;
