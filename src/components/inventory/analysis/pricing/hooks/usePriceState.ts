import { useState } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';

/**
 * Hook to manage price state and calculations
 */
export function usePriceState(productPrices: ProductPrice[]) {
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, Record<string, number | string>>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  /**
   * Calculate the price for a selected SKU based on quantity
   */
  const calculateTotalPrice = (productId: string, sku: string, quantityValue: string) => {
    // Find the product price data
    const productPrice = productPrices.find(p => p.id === productId);
    if (!productPrice) return;

    const quantity = parseInt(quantityValue);
    if (isNaN(quantity) || quantity <= 0) return;

    let unitPrice = 0;

    // Determine which price to use based on quantity
    if (quantity <= 1000) {
      unitPrice = productPrice.price_1000 || 0;
    } else if (quantity <= 2000) {
      unitPrice = productPrice.price_2000 || 0;
    } else if (quantity <= 3000) {
      unitPrice = productPrice.price_3000 || 0;
    } else if (quantity <= 4000) {
      unitPrice = productPrice.price_4000 || 0;
    } else if (quantity <= 5000) {
      unitPrice = productPrice.price_5000 || 0;
    } else {
      unitPrice = productPrice.price_8000 || 0;
    }

    // Calculate total price
    const totalPrice = unitPrice * quantity;

    // Update calculated prices state
    setCalculatedPrices(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [sku]: totalPrice
      }
    }));
  };

  /**
   * Get the unit price for a SKU based on quantity
   */
  const getUnitPriceForSKU = (productId: string, sku: string, quantityStr?: string): number => {
    const productPrice = productPrices.find(p => p.id === productId);
    if (!productPrice) return 0;

    let quantity = 0;
    if (quantityStr) {
      quantity = parseInt(quantityStr);
      if (isNaN(quantity)) quantity = 0;
    }

    if (quantity <= 0) return 0;

    if (quantity <= 1000) return productPrice.price_1000 || 0;
    if (quantity <= 2000) return productPrice.price_2000 || 0;
    if (quantity <= 3000) return productPrice.price_3000 || 0;
    if (quantity <= 4000) return productPrice.price_4000 || 0;
    if (quantity <= 5000) return productPrice.price_5000 || 0;
    return productPrice.price_8000 || 0;
  };

  /**
   * Get the calculated price for a specific SKU
   */
  const getPriceForSKU = (productId: string, sku: string): number | string => {
    return calculatedPrices[productId]?.[sku] || 0;
  };

  /**
   * Get the total price for all selected SKUs of a product
   */
  const getTotalForProduct = (productId: string): number => {
    if (!calculatedPrices[productId]) return 0;

    return Object.values(calculatedPrices[productId]).reduce((total, price) => {
      return total + (typeof price === 'number' ? price : 0);
    }, 0);
  };

  /**
   * Clear the price data for a specific SKU
   */
  const clearPriceForSKU = (productId: string, sku: string) => {
    setCalculatedPrices(prev => {
      if (!prev[productId]) return prev;

      const updatedPrices = { ...prev[productId] };
      delete updatedPrices[sku];

      // If there are no more prices for this product, remove the product entry
      if (Object.keys(updatedPrices).length === 0) {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      }

      // Otherwise, update the prices for this product
      return {
        ...prev,
        [productId]: updatedPrices
      };
    });
  };

  /**
   * Reset all price calculations
   */
  const resetPriceCalculations = () => {
    setCalculatedPrices({});
    setSimulationTotal(0);
  };

  return {
    calculatedPrices,
    simulationTotal,
    setSimulationTotal,
    calculateTotalPrice,
    getPriceForSKU,
    getUnitPriceForSKU,
    getTotalForProduct,
    clearPriceForSKU,
    resetPriceCalculations
  };
}
