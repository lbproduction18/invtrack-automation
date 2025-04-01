
import { useEffect, useMemo } from 'react';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';

// Define a proper type for the analysis products
interface AnalysisProduct {
  id: string;
  product_name: string;
  sku: string;
  category: string;
}

export function useProductCategories() {
  const { products: allProducts, isLoading } = useProducts();
  const { analysisItems } = useAnalysisItems();
  
  // Group products by their category
  const products = useMemo(() => {
    if (!allProducts) return [];
    return allProducts;
  }, [allProducts]);
  
  // Group analysis products by their category for the simulation
  const groupedAnalysisProducts = useMemo(() => {
    if (!analysisItems) return [] as AnalysisProduct[];
    
    return analysisItems.map(item => ({
      id: item.id,
      product_name: item.sku_label || 'Unknown Product',
      sku: item.sku_code || '',
      category: 'analysis'
    })) as AnalysisProduct[];
  }, [analysisItems]);

  return {
    products,
    isLoading,
    groupedAnalysisProducts
  };
}
