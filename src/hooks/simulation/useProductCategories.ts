import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

interface CategoryProduct {
  id: string;
  SKU: string;
  productName: string;
  [key: string]: any;
}

/**
 * Hook to group analysis products by category
 */
export function useProductCategories() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['analysisProducts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('Low stock product')
          .select('*')
          .eq('status', 'analysis');
        
        if (error) {
          console.error('Error fetching analysis products:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Exception when fetching analysis products:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false
  });
  
  // Group analysis products by category
  const groupedAnalysisProducts = (products || []).reduce((acc: Record<string, CategoryProduct[]>, product: any) => {
    // Extract category from SKU (e.g., "COLLAGENE" from "COLLAGENE-LOTUS")
    const skuParts = product.SKU?.split('-') || ['Other'];
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
  }, {});

  // Format data for category-based components
  const categories = Object.entries(groupedAnalysisProducts).map(([name, products]) => ({
    name,
    products: products.map(p => ({
      id: p.id,
      product_name: p.productName
    }))
  }));
  
  return {
    categories,
    isLoading,
    error
  };
}
