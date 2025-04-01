
import { useMemo } from 'react';
import { useProductPrices, type ProductPrice } from '@/hooks/useProductPrices';
import { useProductCategories } from './useProductCategories';

/**
 * Hook to manage budget simulation functionality for analysis
 * @param onSimulationRun Callback to run when simulation is executed
 */
export function useBudgetSimulation(onSimulationRun: () => void) {
  const { productPrices, productPricesByName } = useProductPrices();
  const { categories } = useProductCategories();

  /**
   * Get the selected products list for simulation
   */
  const simulationProducts = useMemo(() => {
    const allProducts: any[] = [];
    
    // Flatten categories and products
    categories.forEach(category => {
      category.products.forEach(product => {
        allProducts.push({
          id: product.id,
          name: product.product_name
        });
      });
    });
    
    return allProducts;
  }, [categories]);

  /**
   * Calculate price for a selected quantity
   */
  const getUnitPriceForSKU = (productId: string, sku: string, quantity: string = '1000'): number => {
    if (!sku) return 0;
    
    // Find the matching product price object from productPrices
    const matchingProduct = productPrices.find(price => {
      // First try exact match
      if (price.product_name.toLowerCase() === sku.toLowerCase()) {
        return true;
      }
      
      // Then try SKU match - extract base SKU part
      const skuParts = sku.split('-');
      if (skuParts.length > 0) {
        const skuPrefix = skuParts[0].toLowerCase();
        return price.product_name.toLowerCase().includes(skuPrefix);
      }
      
      return false;
    });
    
    if (!matchingProduct) return 0;
    
    // Map quantity to the corresponding price field
    const quantityKey = `price_${quantity}` as keyof ProductPrice;
    const price = matchingProduct[quantityKey] as number;
    
    return price || 0;
  };

  return {
    getUnitPriceForSKU,
    simulationProducts,
    runSimulation: onSimulationRun
  };
}
