
import { type ProductPrice } from '@/hooks/useProductPrices';

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
export function getQuantityOptions() {
  return [1000, 2000, 3000, 4000, 5000, 8000];
}
