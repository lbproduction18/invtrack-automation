
import { useState, useEffect } from 'react';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';

export function useSimulationState() {
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, SelectedSKU[]>>({});
  
  // Calculate total price for a specific SKU
  const calculateSKUTotal = (sku: SelectedSKU): number => {
    return sku.quantity * sku.price;
  };
  
  // Calculate the total order amount
  const calculateOrderTotal = (): number => {
    let total = 0;
    
    Object.values(selectedSKUs).forEach(skuArray => {
      skuArray.forEach(sku => {
        total += calculateSKUTotal(sku);
      });
    });
    
    setSimulationTotal(total);
    return total;
  };
  
  // Calculate deposit amount based on percentage (usually 50%)
  const calculateDeposit = (percentage: number = 50): number => {
    return (simulationTotal * percentage) / 100;
  };
  
  // Calculate budget percentage spent
  const calculateBudgetPercentage = (totalBudget: number): number => {
    if (totalBudget <= 0) return 0;
    return (simulationTotal / totalBudget) * 100;
  };
  
  // Update the total whenever selections change
  useEffect(() => {
    calculateOrderTotal();
  }, [selectedSKUs]);

  return {
    simulationTotal,
    selectedSKUs,
    setSelectedSKUs,
    calculateSKUTotal,
    calculateOrderTotal,
    calculateDeposit,
    calculateBudgetPercentage
  };
}
