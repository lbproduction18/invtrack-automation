
import { ProductPrice } from '@/hooks/useProductPrices';
import { useQuantityState } from './useQuantityState';
import { usePriceState } from './usePriceState';
import { useNotifications } from './useNotifications';

/**
 * Hook to manage price calculations
 */
export function usePriceCalculation(productPrices: ProductPrice[]) {
  // Use our smaller, focused hooks
  const { quantities, handleQuantityChange, getQuantityForSKU, clearQuantityForSKU, resetQuantityState } = useQuantityState();
  const { 
    calculatedPrices, 
    simulationTotal, 
    setSimulationTotal,
    calculateTotalPrice, 
    getPriceForSKU, 
    getUnitPriceForSKU, 
    getTotalForProduct,
    clearPriceForSKU,
    resetPriceCalculations
  } = usePriceState(productPrices);
  const { notifyProductRemoved } = useNotifications();

  /**
   * Update quantity and calculate price
   */
  const handleQuantityUpdate = async (productId: string, sku: string, quantityValue: string) => {
    // Update quantity
    await handleQuantityChange(productId, sku, quantityValue);
    
    // Calculate price based on the new quantity
    calculateTotalPrice(productId, sku, quantityValue);
  };

  /**
   * Clear price data for a specific SKU
   */
  const clearPriceDataForSKU = (productId: string, sku: string) => {
    // Clear quantity data
    clearQuantityForSKU(productId, sku);
    
    // Clear calculated price data
    clearPriceForSKU(productId, sku);
    
    // Notify the user
    notifyProductRemoved(sku);
  };

  /**
   * Get the unit price for a specific SKU
   */
  const getUnitPrice = (productId: string, sku: string): number => {
    const quantityValue = quantities[productId]?.[sku] || '0';
    return getUnitPriceForSKU(productId, sku, quantityValue);
  };

  /**
   * Reset all price calculations
   */
  const resetCalculations = () => {
    // Reset price calculations
    resetPriceCalculations();
    
    // Reset quantity state
    resetQuantityState();
    
    // Reset simulation total
    setSimulationTotal(0);
  };

  return {
    quantities,
    calculatedPrices,
    simulationTotal,
    setSimulationTotal,
    getQuantityForSKU,
    getPriceForSKU,
    getTotalForProduct,
    handleQuantityChange: handleQuantityUpdate,
    getUnitPriceForSKU: getUnitPrice,
    clearPriceDataForSKU,
    resetPriceCalculations: resetCalculations
  };
}
