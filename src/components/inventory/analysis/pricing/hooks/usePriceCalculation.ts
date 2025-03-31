
import { useState, useEffect } from 'react';
import { calculateProductTotal } from './utils/priceUtils';

/**
 * Hook to manage calculated prices state
 */
export function usePriceCalculation() {
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, Record<string, number | string>>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  /**
   * Get price for a specific SKU
   */
  const getPriceForSKU = (productId: string, sku: string): number | string => {
    return calculatedPrices[productId]?.[sku] || 0;
  };

  /**
   * Set the calculated price for a specific SKU
   */
  const setCalculatedPrice = (productId: string, sku: string, price: number | string) => {
    setCalculatedPrices(prev => {
      const updatedPrices = { ...prev };
      if (!updatedPrices[productId]) {
        updatedPrices[productId] = {};
      }
      updatedPrices[productId][sku] = price;
      return updatedPrices;
    });
  };

  /**
   * Clear price for a specific SKU
   */
  const clearPriceForSKU = (productId: string, sku: string) => {
    setCalculatedPrices(prev => {
      const updatedPrices = { ...prev };
      if (updatedPrices[productId]) {
        delete updatedPrices[productId][sku];
        if (Object.keys(updatedPrices[productId]).length === 0) {
          delete updatedPrices[productId];
        }
      }
      return updatedPrices;
    });
  };

  /**
   * Calculate and update total simulation price
   */
  const calculateSimulationTotal = () => {
    let total = 0;
    
    Object.keys(calculatedPrices).forEach(productId => {
      total += calculateProductTotal(productId, calculatedPrices);
    });
    
    setSimulationTotal(total);
    return total;
  };

  /**
   * Reset all price calculations
   */
  const resetPriceCalculations = () => {
    setCalculatedPrices({});
    setSimulationTotal(0);
  };

  // Recalculate total whenever calculated prices change
  useEffect(() => {
    calculateSimulationTotal();
  }, [calculatedPrices]);

  return {
    calculatedPrices,
    simulationTotal,
    getPriceForSKU,
    setCalculatedPrice,
    clearPriceForSKU,
    calculateSimulationTotal,
    resetPriceCalculations,
    getTotalForProduct: (productId: string) => calculateProductTotal(productId, calculatedPrices)
  };
}
