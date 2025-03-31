
import { useState } from 'react';
import { useQuantityUpdate } from './useQuantityUpdate';

/**
 * Hook to manage quantities state
 */
export function useQuantityState() {
  const [quantities, setQuantities] = useState<Record<string, Record<string, string>>>({});
  const { updateAnalysisItemQuantity } = useQuantityUpdate();

  /**
   * Update quantity for a specific SKU of a product
   */
  const handleQuantityChange = async (productId: string, sku: string, quantityValue: string) => {
    setQuantities(prev => {
      const productQuantities = prev[productId] || {};
      
      return {
        ...prev,
        [productId]: {
          ...productQuantities,
          [sku]: quantityValue
        }
      };
    });
    
    // Update quantity in Supabase
    const quantity = parseInt(quantityValue, 10);
    if (!isNaN(quantity) && quantity > 0) {
      await updateAnalysisItemQuantity(productId, quantity);
    }
    
    return quantityValue;
  };

  /**
   * Get the quantity for a specific SKU
   */
  const getQuantityForSKU = (sku: string, selectedSKUs: Record<string, string[]>): string => {
    // Find the product ID that has this SKU selected
    for (const [productId, skus] of Object.entries(selectedSKUs)) {
      if (skus.includes(sku) && quantities[productId] && quantities[productId][sku]) {
        return quantities[productId][sku];
      }
    }
    return '';
  };

  /**
   * Clear quantity data for a specific SKU
   */
  const clearQuantityForSKU = (productId: string, sku: string) => {
    setQuantities(prev => {
      const newQuantities = { ...prev };
      if (newQuantities[productId]) {
        const productQuantities = { ...newQuantities[productId] };
        delete productQuantities[sku];
        
        if (Object.keys(productQuantities).length === 0) {
          delete newQuantities[productId];
        } else {
          newQuantities[productId] = productQuantities;
        }
      }
      return newQuantities;
    });
  };

  /**
   * Reset all quantity data
   */
  const resetQuantityState = () => {
    setQuantities({});
  };

  return {
    quantities,
    handleQuantityChange,
    getQuantityForSKU,
    clearQuantityForSKU,
    resetQuantityState
  };
}
