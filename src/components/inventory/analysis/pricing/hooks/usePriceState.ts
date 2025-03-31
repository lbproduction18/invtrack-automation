
import { useState } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { calculateTotalPriceForSKU, getUnitPriceForQuantity } from '../utils/priceCalculationUtils';

/**
 * Hook to manage calculated prices state
 */
export function usePriceState(productPrices: ProductPrice[]) {
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, Record<string, number | string>>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  /**
   * Calculate the total price for a specific SKU
   */
  const calculateTotalPrice = (productId: string, sku: string, quantityValue: string) => {
    const quantity = parseInt(quantityValue, 10);
    const product = productPrices.find(p => p.id === productId);
    
    if (!product || isNaN(quantity) || quantity <= 0) {
      setCalculatedPrices(prev => {
        const productPrices = prev[productId] || {};
        return {
          ...prev,
          [productId]: {
            ...productPrices,
            [sku]: ""
          }
        };
      });
      return;
    }
    
    // Calculate the price using our utility function
    const { price, message } = calculateTotalPriceForSKU(product, quantity);
    
    // Update the calculated prices state
    setCalculatedPrices(prev => {
      const productPrices = prev[productId] || {};
      return {
        ...prev,
        [productId]: {
          ...productPrices,
          [sku]: price !== null ? price : message || ""
        }
      };
    });
  };

  /**
   * Get the calculated price for a specific SKU
   */
  const getPriceForSKU = (sku: string, selectedSKUs: Record<string, string[]>): number | string => {
    // Find the product ID that has this SKU selected
    for (const [productId, skus] of Object.entries(selectedSKUs)) {
      if (skus.includes(sku) && calculatedPrices[productId] && typeof calculatedPrices[productId][sku] === 'number') {
        return calculatedPrices[productId][sku] as number;
      }
    }
    return '';
  };

  /**
   * Get the unit price for a specific SKU based on the selected quantity
   */
  const getUnitPriceForSKU = (productId: string, sku: string, quantityValue: string): number => {
    const product = productPrices.find(p => p.id === productId);
    const quantity = parseInt(quantityValue, 10);
    
    return getUnitPriceForQuantity(product, quantity);
  };

  /**
   * Calculate the total price for a specific product (sum of all SKUs)
   */
  const getTotalForProduct = (productId: string): number => {
    if (!calculatedPrices[productId]) {
      return 0;
    }
    
    let total = 0;
    
    Object.values(calculatedPrices[productId]).forEach(price => {
      if (typeof price === 'number') {
        total += price;
      }
    });
    
    return total;
  };

  /**
   * Clear price data for a specific SKU
   */
  const clearPriceForSKU = (productId: string, sku: string) => {
    setCalculatedPrices(prev => {
      const newPrices = { ...prev };
      if (newPrices[productId]) {
        const productPrices = { ...newPrices[productId] };
        delete productPrices[sku];
        
        if (Object.keys(productPrices).length === 0) {
          delete newPrices[productId];
        } else {
          newPrices[productId] = productPrices;
        }
      }
      return newPrices;
    });
  };

  return {
    calculatedPrices,
    simulationTotal,
    setSimulationTotal,
    calculateTotalPrice,
    getPriceForSKU,
    getUnitPriceForSKU,
    getTotalForProduct,
    clearPriceForSKU
  };
}
