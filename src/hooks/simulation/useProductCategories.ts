
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export const useProductCategories = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, product_name, category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      // Extract unique categories
      const categories = Array.from(new Set(data.map(product => product.category))).filter(Boolean);
      
      // Create category data structure
      return categories.map(category => ({
        name: category as string,
        products: data
          .filter(product => product.category === category)
          .map(product => ({
            id: product.id,
            product_name: product.product_name,
          })),
      }));
    },
  });

  return { categories: data, isLoading, error };
};
