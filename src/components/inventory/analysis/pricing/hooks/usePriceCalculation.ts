
import { ProductPrice } from '@/hooks/useProductPrices';
import { useQuantityState } from './useQuantityState';
import { usePriceState } from './usePriceState';
import { useNotifications } from './useNotifications';
import { useState } from 'react';

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
    getTotalPrice, 
    calculatePrice, 
    resetPrices 
  } = usePriceState(productPrices);
  const { notifyProductRemoved } = useNotifications();

  // Initialize local state for storing detailed price data per product/SKU
  const [detailedPrices, setDetailedPrices] = useState<Record<string, Record<string, number>>>({});

  /**
   * Calculate price for a specific SKU
   */
  const calculateTotalPrice = (productId: string, sku: string, quantityValue: string) => {
    const quantity = parseInt(quantityValue);
    if (isNaN(quantity) || quantity <= 0) return;
    
    // Find the product in productPrices
    const product = productPrices.find(p => p.id === productId);
    if (!product) {
      console.warn(`No product found with ID: ${productId}`);
      return;
    }
    
    // Get the unit price based on quantity
    const unitPrice = getUnitPriceForProduct(product, quantity);
    // Ensure we're dealing with numeric values for multiplication
    const totalPrice = unitPrice * quantity;
    
    // Store the calculated price
    setDetailedPrices(prev => {
      const updatedPrices = { ...prev };
      if (!updatedPrices[productId]) {
        updatedPrices[productId] = {};
      }
      updatedPrices[productId][sku] = totalPrice;
      return updatedPrices;
    });
    
    // Update simulation total
    updateSimulationTotal();
  };

  /**
   * Get unit price for a product based on quantity
   */
  const getUnitPriceForProduct = (product: ProductPrice, quantity: number): number => {
    if (!product) return 0;
    
    if (quantity <= 1000 && product.price_1000) {
      return product.price_1000;
    } else if (quantity <= 2000 && product.price_2000) {
      return product.price_2000;
    } else if (quantity <= 3000 && product.price_3000) {
      return product.price_3000;
    } else if (quantity <= 4000 && product.price_4000) {
      return product.price_4000;
    } else if (quantity <= 5000 && product.price_5000) {
      return product.price_5000;
    } else if (quantity <= 8000 && product.price_8000) {
      return product.price_8000;
    } else if (product.price_8000) {
      return product.price_8000;
    }
    
    return 0;
  };

  /**
   * Get unit price for a specific SKU
   */
  const getUnitPriceForSKU = (productId: string, sku: string, quantityStr: string = '0') => {
    const product = productPrices.find(p => p.id === productId);
    const quantity = parseInt(quantityStr);
    
    return getUnitPriceForProduct(product, quantity);
  };

  /**
   * Get price for a specific SKU
   */
  const getPriceForSKU = (productId: string, sku: string) => {
    return detailedPrices[productId]?.[sku] || 0;
  };

  /**
   * Get total price for a product (sum of all its SKUs)
   */
  const getTotalForProduct = (productId: string) => {
    const productPrices = detailedPrices[productId] || {};
    return Object.values(productPrices).reduce((total, price) => {
      // Ensure we're dealing with numeric values for addition
      const numericPrice = typeof price === 'number' ? price : 0;
      return total + numericPrice;
    }, 0);
  };

  /**
   * Clear price for a specific SKU
   */
  const clearPriceForSKU = (productId: string, sku: string) => {
    setDetailedPrices(prev => {
      const updated = { ...prev };
      if (updated[productId] && updated[productId][sku] !== undefined) {
        const { [sku]: _, ...rest } = updated[productId];
        updated[productId] = rest;
        
        // If no SKUs left for this product, remove the product entry
        if (Object.keys(updated[productId]).length === 0) {
          const { [productId]: __, ...remaining } = updated;
          return remaining;
        }
      }
      return updated;
    });
    
    // Update simulation total
    updateSimulationTotal();
  };

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
   * Calculate and update the simulation total
   */
  const updateSimulationTotal = () => {
    const total = Object.values(detailedPrices).reduce((sum, productPrices) => {
      return sum + Object.values(productPrices).reduce((productSum, price) => {
        // Ensure we're dealing with numeric values
        return productSum + price;
      }, 0);
    }, 0);
    
    setSimulationTotal(total);
  };

  /**
   * Reset all price calculations
   */
  const resetPriceCalculations = () => {
    // Reset price calculations
    resetPrices();
    
    // Reset detailed prices
    setDetailedPrices({});
    
    // Reset quantity state
    resetQuantityState();
  };

  return {
    quantities,
    calculatedPrices: detailedPrices,
    simulationTotal,
    setSimulationTotal,
    getQuantityForSKU,
    getPriceForSKU,
    getTotalForProduct,
    handleQuantityChange: handleQuantityUpdate,
    getUnitPriceForSKU,
    clearPriceDataForSKU,
    resetPriceCalculations
  };
}
