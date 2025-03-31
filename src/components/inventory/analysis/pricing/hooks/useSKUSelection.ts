import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to manage SKU selection state
 */
export function useSKUSelection() {
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  /**
   * Add a SKU to the selection
   */
  const handleSKUSelect = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      // If this SKU is already selected for this product, don't add it again
      if (prev[productId]?.includes(sku)) {
        return prev;
      }

      // Add the SKU to the list for this product
      return {
        ...prev,
        [productId]: [...(prev[productId] || []), sku]
      };
    });
  };

  /**
   * Remove a SKU from the selection
   */
  const handleSKURemove = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      if (!prev[productId]) {
        return prev;
      }

      const updatedSKUs = prev[productId].filter(s => s !== sku);
      
      // If there are no more SKUs for this product, remove the product entry
      if (updatedSKUs.length === 0) {
        const updatedSelection = { ...prev };
        delete updatedSelection[productId];
        return updatedSelection;
      }
      
      // Otherwise, update the SKUs for this product
      return {
        ...prev,
        [productId]: updatedSKUs
      };
    });
  };

  /**
   * Reset all selected SKUs
   */
  const resetSKUSelection = () => {
    setSelectedSKUs({});
    toast({
      title: "Simulation réinitialisée",
      description: "Toutes les sélections ont été effacées.",
    });
  };

  return {
    selectedSKUs,
    handleSKUSelect,
    handleSKURemove,
    resetSKUSelection
  };
}
