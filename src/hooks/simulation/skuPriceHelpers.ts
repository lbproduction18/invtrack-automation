
import { type ProductPrice } from '@/hooks/useProductPrices';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

/**
 * Helper function to find matching product price by category
 */
export function findMatchingProductPrice(productCategory: string, productPrices: ProductPrice[]): ProductPrice | undefined {
  return productPrices.find(p => {
    const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
  });
}

/**
 * Helper function to get the available quantity options
 */
export function getQuantityOptions(): QuantityOption[] {
  return [1000, 2000, 3000, 4000, 5000, 8000];
}

/**
 * Get the price for a specific quantity tier
 */
export function getPriceForQuantity(product: ProductPrice, quantity: QuantityOption): number {
  const priceField = `price_${quantity}` as keyof typeof product;
  const price = product[priceField] as number;
  return price || 0;
}

/**
 * Calculate the total price based on quantity and unit price
 */
export function calculateTotalPrice(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

/**
 * Helper to get the unit price for a specific SKU and quantity
 */
export function getUnitPriceForSKU(productPrices: ProductPrice[], sku: string, quantity: number): number {
  // Extract the category from the SKU (e.g., "BNT" from "BNT-LOTUS")
  const skuParts = sku.split('-');
  const productCategory = skuParts[0];
  
  const productPrice = findMatchingProductPrice(productCategory, productPrices);
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

  return Number(productPrice[priceField]) || 0;
}

/**
 * Calculate total price for a SKU based on quantity
 */
export function calculateSKUTotalPrice(sku: string, quantity: number, productPrices: ProductPrice[]): number {
  const unitPrice = getUnitPriceForSKU(productPrices, sku, quantity);
  return calculateTotalPrice(unitPrice, quantity);
}
