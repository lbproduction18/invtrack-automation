
import { useState } from 'react';

/**
 * Hook to manage quantities state
 */
export function useQuantityManagement() {
  const [quantities, setQuantities] = useState<Record<string, Record<string, string>>>({});

  /**
   * Handle quantity change for a selected SKU
   */
  const handleQuantityChange = (productId: string, sku: string, quantityValue: string) => {
    setQuantities(prev => {
      const updatedQuantities = { ...prev };
      if (!updatedQuantities[productId]) {
        updatedQuantities[productId] = {};
      }
      updatedQuantities[productId][sku] = quantityValue;
      return updatedQuantities;
    });
    
    return quantityValue;
  };

  /**
   * Clear quantity for a specific SKU
   */
  const clearQuantityForSKU = (productId: string, sku: string) => {
    setQuantities(prev => {
      const updatedQuantities = { ...prev };
      if (updatedQuantities[productId]) {
        delete updatedQuantities[productId][sku];
        if (Object.keys(updatedQuantities[productId]).length === 0) {
          delete updatedQuantities[productId];
        }
      }
      return updatedQuantities;
    });
  };

  /**
   * Reset all quantities
   */
  const resetQuantities = () => {
    setQuantities({});
  };

  return {
    quantities,
    handleQuantityChange,
    clearQuantityForSKU,
    resetQuantities
  };
}
