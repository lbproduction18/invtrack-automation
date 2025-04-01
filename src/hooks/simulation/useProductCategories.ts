
import { useEffect, useMemo } from 'react';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';

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
    try {
      if (!analysisItems || analysisItems.length === 0) {
        console.log("No analysis items found.");
        return [];
      }
      
      // Ensure we return an array of products transformed from analysisItems
      console.log("Transforming analysis items:", analysisItems);
      return analysisItems.map(item => {
        if (!item) {
          console.warn("Found null or undefined analysis item");
          return null;
        }
        return {
          id: item.id || "",
          product_name: item.sku_label || 'Unknown Product',
          sku: item.sku_code || '',
          category: 'analysis'
        };
      }).filter(Boolean); // Remove any null items
    } catch (error) {
      console.error("Error in groupedAnalysisProducts:", error);
      return [];
    }
  }, [analysisItems]);

  return {
    products,
    isLoading,
    groupedAnalysisProducts
  };
}
