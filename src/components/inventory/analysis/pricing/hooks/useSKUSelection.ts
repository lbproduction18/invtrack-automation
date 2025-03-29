
import { useState } from 'react';

/**
 * Hook to manage SKU selection
 */
export function useSKUSelection() {
  // Change from Record<string, string> to Record<string, string[]>
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string[]>>({});

  /**
   * Add a SKU to a product's selection
   */
  const handleSKUSelect = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      // Get the current SKUs for this product or initialize an empty array
      const currentSKUs = prev[productId] || [];
      
      // Check if this SKU is already in the list
      if (currentSKUs.includes(sku)) {
        return prev;
      }
      
      // Add the new SKU to the list
      return {
        ...prev,
        [productId]: [...currentSKUs, sku]
      };
    });
  };

  /**
   * Remove a SKU from a product's selection
   */
  const handleSKURemove = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      const currentSKUs = prev[productId] || [];
      const updatedSKUs = currentSKUs.filter(s => s !== sku);
      
      // If there are no SKUs left, remove the product from the map
      if (updatedSKUs.length === 0) {
        const newSelectedSKUs = { ...prev };
        delete newSelectedSKUs[productId];
        return newSelectedSKUs;
      }
      
      return {
        ...prev,
        [productId]: updatedSKUs
      };
    });
  };

  return {
    selectedSKUs,
    setSelectedSKUs,
    handleSKUSelect,
    handleSKURemove
  };
}
