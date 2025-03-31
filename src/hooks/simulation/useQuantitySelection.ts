
import { useState, useEffect } from 'react';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { QuantityOption } from '@/components/inventory/AnalysisContent';
import { useProducts } from '@/hooks/useProducts';

/**
 * Hook to manage quantity selections for products
 */
export function useQuantitySelection() {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, string>>({});
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('analysis');
  
  // Handle order quantity change for a product
  const handleOrderQuantityChange = (productId: string, quantityValue: string) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantityValue
    }));
  };
  
  // Sync product quantities from analysis_items on component load
  useEffect(() => {
    // Get product quantities from analysis_items
    const quantities: Record<string, string> = {};
    
    analysisItems.forEach(item => {
      if (item.product_id && item.quantity_selected) {
        quantities[item.product_id] = item.quantity_selected.toString();
      }
    });
    
    setSelectedQuantities(quantities);
  }, [analysisItems]);
  
  return {
    selectedQuantities,
    handleOrderQuantityChange
  };
}
