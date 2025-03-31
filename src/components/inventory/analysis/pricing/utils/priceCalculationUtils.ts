
import { ProductPrice } from '@/hooks/useProductPrices';
import { findPriceTierForQuantity, hasOnlyPrice8000 } from './pricingUtils';

/**
 * Calculate the total price for a specific SKU based on quantity
 */
export const calculateTotalPriceForSKU = (
  product: ProductPrice | undefined,
  quantity: number
): { price: number | null; message?: string } => {
  if (!product || isNaN(quantity) || quantity <= 0) {
    return { price: null };
  }
  
  // Check if this product only has price_8000 defined
  const onlyHas8000 = hasOnlyPrice8000(product);
  
  // Special case: If product only has price_8000 defined and quantity is not 8000
  if (onlyHas8000 && quantity !== 8000) {
    return { 
      price: null, 
      message: "Ce produit doit être commandé en quantité exacte de 8000 unités." 
    };
  }
  
  // Find the appropriate price tier
  const { tierPrice, message } = findPriceTierForQuantity(product, quantity);
  
  // If we have a message instead of a price, return it
  if (message) {
    return { price: null, message };
  }
  
  // Calculate the total price based on the tier price
  if (tierPrice > 0) {
    return { price: quantity * tierPrice };
  }
  
  return { price: null, message: "Prix non disponible pour cette quantité" };
};

/**
 * Get the unit price for a specific SKU based on quantity
 */
export const getUnitPriceForQuantity = (
  product: ProductPrice | undefined,
  quantity: number
): number => {
  if (!product || isNaN(quantity) || quantity <= 0) {
    return 0;
  }
  
  // Find the appropriate price tier
  const { tierPrice } = findPriceTierForQuantity(product, quantity);
  return tierPrice;
};

/**
 * Calculate the total sum for all products in calculatedPrices
 */
export const calculateSimulationTotal = (
  calculatedPrices: Record<string, Record<string, number | string>>
): number => {
  let total = 0;
  
  // Sum up all the numeric values in calculatedPrices
  Object.keys(calculatedPrices).forEach(productId => {
    Object.values(calculatedPrices[productId] || {}).forEach(price => {
      if (typeof price === 'number') {
        total += price;
      }
    });
  });
  
  return total;
};
