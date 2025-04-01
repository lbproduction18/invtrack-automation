
import { useMemo } from 'react';
import { Product } from '@/types/product';

export function useProductCategories(products: Product[]) {
  const categories = useMemo(() => {
    const categorizedProducts: Record<string, Product[]> = {};
    
    products.forEach(product => {
      // Extract category from product name (first word)
      const category = product.product_name?.split(' ')[0] || 'Other';
      
      if (!categorizedProducts[category]) {
        categorizedProducts[category] = [];
      }
      
      categorizedProducts[category].push(product);
    });
    
    return categorizedProducts;
  }, [products]);
  
  return { categories };
}
