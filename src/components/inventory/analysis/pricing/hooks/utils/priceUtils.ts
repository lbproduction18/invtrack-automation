
import { ProductPrice } from '@/hooks/useProductPrices';
import { getUnitPriceForSKU as skuPriceHelperGetUnitPrice, calculateTotalPrice } from '@/hooks/simulation/skuPriceHelpers';

/**
 * Calculate total price for a product from its SKUs
 */
export const calculateProductTotal = (
  productId: string, 
  calculatedPrices: Record<string, Record<string, number | string>>
): number => {
  if (!calculatedPrices[productId]) return 0;
  
  // Create an array of numeric values and then sum them to avoid type issues
  const priceValues = Object.values(calculatedPrices[productId]);
  const numericPrices: number[] = priceValues.map(p => {
    if (typeof p === 'number') return p;
    return Number(p) || 0;
  });
  
  return numericPrices.reduce((sum, price) => sum + price, 0);
};

/**
 * Calculate total price for a specific SKU based on quantity
 */
export const calculateSKUTotalPrice = (
  sku: string, 
  quantity: number,
  productPrices: ProductPrice[]
): number => {
  const unitPrice = getUnitPriceForSKU(productPrices, sku, quantity);
  return calculateTotalPrice(unitPrice, quantity);
};

/**
 * Export the getUnitPriceForSKU function from skuPriceHelpers
 * to maintain the same interface for components using this module
 */
export const getUnitPriceForSKU = (
  productPrices: ProductPrice[], 
  sku: string, 
  quantity: number
): number => {
  return skuPriceHelperGetUnitPrice(productPrices, sku, quantity);
};
