
import { useState, useEffect } from 'react';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { QuantityOption } from '@/components/inventory/AnalysisContent';
import { useProducts } from '@/hooks/useProducts';

/**
 * Hook to manage quantity selections for products
 */
export function useQuantitySelection() {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, QuantityOption>>({});
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('analysis');
  
  // Handle order quantity change for a product
  const handleOrderQuantityChange = (productId: string, quantityValue: QuantityOption) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantityValue
    }));
    
    return quantityValue; // Return the value for chaining
  };
  
  // Sync product quantities from analysis_items on component load
  useEffect(() => {
    // Get product quantities from analysis_items
    const quantities: Record<string, QuantityOption> = {};
    
    analysisItems.forEach(item => {
      if (item.product_id && item.quantity_selected) {
        // Convert to the correct QuantityOption type
        const quantity = Number(item.quantity_selected) as QuantityOption;
        quantities[item.product_id] = quantity;
      }
    });
    
    setSelectedQuantities(quantities);
  }, [analysisItems]);
  
  return {
    selectedQuantities,
    handleOrderQuantityChange,
    setSelectedQuantities
  };
}
