
import { ProductPrice } from '@/hooks/useProductPrices';

/**
 * Get unit price for a specific SKU and quantity
 */
export const getUnitPriceForSKU = (productPrices: ProductPrice[], sku: string, quantity: number): number => {
  // Find the product price entry that matches this SKU
  const productPrice = productPrices.find(price => {
    // Extract the category from the SKU (e.g., "BNT" from "BNT-LOTUS")
    const skuCategory = sku.split('-')[0];
    // Check if the product name contains this category
    return price.product_name.toLowerCase().includes(skuCategory.toLowerCase());
  });

  if (!productPrice) return 0;

  // Determine which price field to use based on quantity
  let priceField: keyof ProductPrice;
  
  if (quantity <= 1000) {
    priceField = 'price_1000';
  } else if (quantity <= 2000) {
    priceField = 'price_2000';
  } else if (quantity <= 3000) {
    priceField = 'price_3000';
  } else if (quantity <= 4000) {
    priceField = 'price_4000';
  } else if (quantity <= 5000) {
    priceField = 'price_5000';
  } else {
    priceField = 'price_8000';
  }

  // Return the price or 0 if not available
  return productPrice[priceField] as number || 0;
};

/**
 * Calculate total price for a product from its SKUs
 */
export const calculateProductTotal = (
  productId: string, 
  calculatedPrices: Record<string, Record<string, number | string>>
): number => {
  if (!calculatedPrices[productId]) return 0;
  
  // Explicitly type the initial value and result of reduce as number
  return Object.values(calculatedPrices[productId]).reduce((sum: number, price) => {
    // Handle different types properly by ensuring we're always working with numbers
    let numericPrice = 0;
    
    if (typeof price === 'number') {
      numericPrice = price;
    } else if (typeof price === 'string') {
      // Try to parse the string as a number, return 0 if it fails
      const parsed = parseFloat(price);
      numericPrice = isNaN(parsed) ? 0 : parsed;
    }
    
    return sum + numericPrice;
  }, 0); // Initialize the accumulator as 0 (number type)
};

/**
 * Calculate total price for a specific SKU based on quantity
 */
export const calculateSKUTotalPrice = (
  sku: string, 
  quantity: number,
  getUnitPrice: (sku: string, quantity: number) => number
): number => {
  const unitPrice = getUnitPrice(sku, quantity);
  return quantity * unitPrice;
};
