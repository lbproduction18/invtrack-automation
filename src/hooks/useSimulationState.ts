
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
  
  // Update the total whenever selections change
  useEffect(() => {
    calculateOrderTotal();
  }, [selectedSKUs]);

  return {
    simulationTotal,
    selectedSKUs,
    setSelectedSKUs,
    calculateSKUTotal,
    calculateOrderTotal
  };
}
