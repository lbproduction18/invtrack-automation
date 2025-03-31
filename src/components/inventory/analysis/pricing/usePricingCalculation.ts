
import { useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { getStandardQuantities } from './utils/pricingUtils';
import { useSKUSelection } from './hooks/useSKUSelection';
import { usePriceCalculation } from './hooks/usePriceCalculation';
import { calculateSimulationTotal } from './utils/priceCalculationUtils';

/**
 * Hook to handle pricing calculations for the pricing grid
 */
export function usePricingCalculation(productPrices: ProductPrice[]) {
  // Use our smaller, focused hooks
  const { selectedSKUs, handleSKUSelect, handleSKURemove, resetSKUSelection } = useSKUSelection();
  const {
    quantities,
    calculatedPrices,
    simulationTotal,
    setSimulationTotal,
    getQuantityForSKU,
    getPriceForSKU,
    getTotalForProduct,
    handleQuantityChange,
    getUnitPriceForSKU,
    clearPriceDataForSKU,
    resetPriceCalculations
  } = usePriceCalculation(productPrices);

  // Standard quantities that match price columns
  const standardQuantities = getStandardQuantities();

  // Calculate the total simulation amount whenever calculatedPrices change
  useEffect(() => {
    const total = calculateSimulationTotal(calculatedPrices);
    setSimulationTotal(total);
  }, [calculatedPrices, setSimulationTotal]);

  // Enhanced SKU removal handler that also clears price data
  const handleSKURemoveWithPriceCleanup = (productId: string, sku: string) => {
    // First clear the price data for this SKU
    clearPriceDataForSKU(productId, sku);
    // Then remove the SKU from the selection
    handleSKURemove(productId, sku);
  };

  // Reset the entire simulation
  const resetSimulation = () => {
    // Reset the SKU selection
    resetSKUSelection();
    // Reset all price calculations
    resetPriceCalculations();
    // Reset the simulation total
    setSimulationTotal(0);
  };

  return {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    standardQuantities,
    getQuantityForSKU,
    getPriceForSKU,
    getTotalForProduct,
    handleSKUSelect,
    handleSKURemove: handleSKURemoveWithPriceCleanup,
    handleQuantityChange,
    getUnitPriceForSKU,
    resetSimulation
  };
}
