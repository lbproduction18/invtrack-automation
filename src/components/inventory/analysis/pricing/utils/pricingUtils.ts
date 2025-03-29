
/**
 * Utility functions for pricing calculations
 */

import { ProductPrice } from '@/hooks/useProductPrices';

/**
 * Check if a product only has price_8000 defined (all other price tiers are NULL or 0)
 */
export const hasOnlyPrice8000 = (product: ProductPrice): boolean => {
  return (
    (!product.price_1000 || product.price_1000 === 0) && 
    (!product.price_2000 || product.price_2000 === 0) && 
    (!product.price_3000 || product.price_3000 === 0) && 
    (!product.price_4000 || product.price_4000 === 0) && 
    (!product.price_5000 || product.price_5000 === 0) && 
    (product.price_8000 && product.price_8000 > 0)
  );
};

/**
 * Get standard quantities that match price columns
 */
export const getStandardQuantities = (): number[] => {
  return [1000, 2000, 3000, 4000, 5000, 8000];
};

/**
 * Find the appropriate price tier based on a product and quantity
 */
export const findPriceTierForQuantity = (
  product: ProductPrice,
  quantity: number
): { tierPrice: number; tierQuantity: number; message?: string } => {
  // Check if quantity exactly matches a tier
  if (quantity === 1000 && product.price_1000) {
    return { tierPrice: product.price_1000, tierQuantity: 1000 };
  } else if (quantity === 2000 && product.price_2000) {
    return { tierPrice: product.price_2000, tierQuantity: 2000 };
  } else if (quantity === 3000 && product.price_3000) {
    return { tierPrice: product.price_3000, tierQuantity: 3000 };
  } else if (quantity === 4000 && product.price_4000) {
    return { tierPrice: product.price_4000, tierQuantity: 4000 };
  } else if (quantity === 5000 && product.price_5000) {
    return { tierPrice: product.price_5000, tierQuantity: 5000 };
  } else if (quantity === 8000 && product.price_8000) {
    return { tierPrice: product.price_8000, tierQuantity: 8000 };
  }
  
  // Quantity doesn't match an exact tier, find the closest lower tier
  // Create an array of available tiers for this product
  const availableTiers = [
    { quantity: 1000, price: product.price_1000 || 0 },
    { quantity: 2000, price: product.price_2000 || 0 },
    { quantity: 3000, price: product.price_3000 || 0 },
    { quantity: 4000, price: product.price_4000 || 0 },
    { quantity: 5000, price: product.price_5000 || 0 },
    { quantity: 8000, price: product.price_8000 || 0 }
  ].filter(tier => tier.price > 0);
  
  // Sort tiers by quantity (ascending)
  availableTiers.sort((a, b) => a.quantity - b.quantity);
  
  if (availableTiers.length === 0) {
    // No price tiers defined for this product
    return { tierPrice: 0, tierQuantity: 0, message: "Aucun prix défini pour ce produit" };
  }
  
  // Case: quantity is lower than the lowest tier
  if (quantity < availableTiers[0].quantity) {
    return {
      tierPrice: 0,
      tierQuantity: 0,
      message: `Quantité minimum: ${availableTiers[0].quantity} unités`
    };
  }
  
  // Case: quantity is higher than all available tiers
  if (quantity > availableTiers[availableTiers.length - 1].quantity) {
    // Use the highest tier
    const highestTier = availableTiers[availableTiers.length - 1];
    return { tierPrice: highestTier.price, tierQuantity: highestTier.quantity };
  }
  
  // Find the closest lower tier
  for (let i = availableTiers.length - 1; i >= 0; i--) {
    if (availableTiers[i].quantity <= quantity) {
      return {
        tierPrice: availableTiers[i].price,
        tierQuantity: availableTiers[i].quantity
      };
    }
  }
  
  // Fallback (shouldn't reach here given the logic above)
  return { tierPrice: 0, tierQuantity: 0, message: "Prix non disponible pour cette quantité" };
};
