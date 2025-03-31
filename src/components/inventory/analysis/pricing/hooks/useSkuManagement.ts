
import { useState } from 'react';

/**
 * Hook to manage SKU selection state
 */
export function useSkuManagement() {
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string[]>>({});

  /**
   * Handle adding a SKU to the selection
   */
  const handleSKUSelect = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = { ...prev };
      if (!updatedSKUs[productId]) {
        updatedSKUs[productId] = [];
      }
      if (!updatedSKUs[productId].includes(sku)) {
        updatedSKUs[productId] = [...updatedSKUs[productId], sku];
      }
      return updatedSKUs;
    });
  };

  /**
   * Handle removing a SKU from the selection
   */
  const handleSKURemove = (productId: string, sku: string, 
    cleanupCallback?: (productId: string, sku: string) => void) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = { ...prev };
      if (updatedSKUs[productId]) {
        updatedSKUs[productId] = updatedSKUs[productId].filter(s => s !== sku);
        if (updatedSKUs[productId].length === 0) {
          delete updatedSKUs[productId];
        }
      }
      return updatedSKUs;
    });

    // Call the cleanup callback if provided
    if (cleanupCallback) {
      cleanupCallback(productId, sku);
    }
  };

  /**
   * Reset the SKU selection
   */
  const resetSKUSelection = () => {
    setSelectedSKUs({});
  };

  return {
    selectedSKUs,
    setSelectedSKUs,
    handleSKUSelect,
    handleSKURemove,
    resetSKUSelection
  };
}
