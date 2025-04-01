
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
 * Get unit price for a specific SKU based on quantity tier
 */
export const getUnitPriceForSKU = (
  productPrices: ProductPrice[], 
  sku: string, 
  quantity: number
): number => {
  // Extract the category from the SKU (e.g., "BNT" from "BNT-LOTUS")
  const skuParts = sku.split('-');
  const productCategory = skuParts[0];
  
  // Find the matching product price
  const productPrice = productPrices.find(p => {
    const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
  });
  
  if (!productPrice) return 0;
  
  // Determine which price field to use based on quantity tier
  let priceField: keyof ProductPrice;
  
  if (quantity <= 1999) {
    priceField = 'price_1000';
  } else if (quantity <= 2999) {
    priceField = 'price_2000';
  } else if (quantity <= 3999) {
    priceField = 'price_3000';
  } else if (quantity <= 4999) {
    priceField = 'price_4000';
  } else if (quantity <= 7999) {
    priceField = 'price_5000';
  } else {
    priceField = 'price_8000';
  }
  
  // If the current tier price is undefined or zero, fall back to the previous available tier
  if (!productPrice[priceField] || productPrice[priceField] === 0) {
    // Try previous tiers in descending order
    const tiers = ['price_8000', 'price_5000', 'price_4000', 'price_3000', 'price_2000', 'price_1000'];
    const currentTierIndex = tiers.indexOf(priceField);
    
    // Look for the next available tier with a price
    for (let i = currentTierIndex + 1; i < tiers.length; i++) {
      const fallbackTier = tiers[i] as keyof ProductPrice;
      if (productPrice[fallbackTier] && productPrice[fallbackTier] !== 0) {
        return Number(productPrice[fallbackTier]) || 0;
      }
    }
    
    // If no previous tier has a price, look at higher tiers
    for (let i = currentTierIndex - 1; i >= 0; i--) {
      const fallbackTier = tiers[i] as keyof ProductPrice;
      if (productPrice[fallbackTier] && productPrice[fallbackTier] !== 0) {
        return Number(productPrice[fallbackTier]) || 0;
      }
    }
  }
  
  return Number(productPrice[priceField]) || 0;
};

/**
 * Export the getUnitPriceForSKU function from skuPriceHelpers
 * and the calculateTotalPrice function to maintain the same interface
 */
export { skuPriceHelperGetUnitPrice, calculateTotalPrice };
