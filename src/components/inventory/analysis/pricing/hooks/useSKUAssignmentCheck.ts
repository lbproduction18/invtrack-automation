
import { useState, useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';

export function useSKUAssignmentCheck(
  analysisMode: 'manual' | 'ai',
  isLoading: boolean,
  productPrices: ProductPrice[],
  selectedSKUs: Record<string, string[]>
) {
  const [allProductsHaveSKUs, setAllProductsHaveSKUs] = useState(false);

  useEffect(() => {
    if (analysisMode === 'ai' && !isLoading) {
      console.log("Checking if all products have SKUs assigned...");
      console.log("Product Prices:", productPrices);
      console.log("Selected SKUs:", selectedSKUs);
      
      // Only consider products that are visible in the grid
      const visibleProductIds = productPrices.map(product => product.id);
      
      if (visibleProductIds.length === 0) {
        setAllProductsHaveSKUs(false);
        return;
      }
      
      // Check if each visible product has at least one SKU assigned
      const allAssigned = visibleProductIds.every(productId => {
        const hasSKU = selectedSKUs[productId] && selectedSKUs[productId].length > 0;
        console.log(`Product ${productId} has SKU: ${hasSKU}`);
        return hasSKU;
      });
      
      console.log("All products have SKUs assigned:", allAssigned);
      setAllProductsHaveSKUs(allAssigned);
    } else {
      setAllProductsHaveSKUs(false);
    }
  }, [selectedSKUs, productPrices, isLoading, analysisMode]);

  return { allProductsHaveSKUs };
}
