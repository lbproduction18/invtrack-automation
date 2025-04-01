import { useProducts } from '@/hooks/useProducts';

/**
 * Hook to group analysis products by category
 */
export function useProductCategories() {
  const { products } = useProducts('analysis');
  
  // Group analysis products by category
  const groupedAnalysisProducts = products.reduce((acc, product) => {
    // Extract category from SKU (e.g., "COLLAGENE" from "COLLAGENE-LOTUS")
    const skuParts = product.SKU.split('-');
    const category = skuParts[0] || 'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push({
      id: product.id,
      SKU: product.SKU,
      productName: product.product_name, // Using product_name from product
      // Other properties that might be needed
      ...product
    });
    
    return acc;
  }, {} as Record<string, typeof products>);
  
  return {
    products,
    groupedAnalysisProducts
  };
}
