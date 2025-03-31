
import { useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { getStandardQuantities } from './utils/pricingUtils';
import { useSKUSelection } from './hooks/useSKUSelection';
import { usePriceCalculation } from './hooks/usePriceCalculation';

/**
 * Hook to handle pricing calculations for the pricing grid
 */
export function usePricingCalculation(productPrices: ProductPrice[]) {
  // Use our smaller, focused hooks
  const { selectedSKUs, handleSKUSelect, handleSKURemove } = useSKUSelection();
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
    clearPriceDataForSKU
  } = usePriceCalculation(productPrices);

  // Standard quantities that match price columns
  const standardQuantities = getStandardQuantities();

  // Calculate the total simulation amount whenever calculatedPrices change
  useEffect(() => {
    let total = 0;
    
    // Sum up all the numeric values in calculatedPrices
    Object.keys(calculatedPrices).forEach(productId => {
      Object.values(calculatedPrices[productId] || {}).forEach(price => {
        if (typeof price === 'number') {
          total += price;
        }
      });
    });
    
    setSimulationTotal(total);
  }, [calculatedPrices, setSimulationTotal]);

  // Enhanced SKU removal handler that also clears price data
  const handleSKURemoveWithPriceCleanup = (productId: string, sku: string) => {
    // First clear the price data for this SKU
    clearPriceDataForSKU(productId, sku);
    // Then remove the SKU from the selection
    handleSKURemove(productId, sku);
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
    getUnitPriceForSKU
  };
}
