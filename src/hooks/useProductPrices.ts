
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ProductPrice {
  id: string;
  product_name: string;
  price_1000: number | null;
  price_2000: number | null;
  price_3000: number | null;
  price_4000: number | null;
  price_5000: number | null;
  price_8000: number | null;
  created_at: string;
  updated_at: string;
}

export function useProductPrices() {
  const { toast } = useToast();

  // Fetch product prices using react-query
  const { 
    data: productPrices = [], 
    isLoading, 
    error,
    refetch: reactQueryRefetch
  } = useQuery({
    queryKey: ['productPrices'],
    queryFn: async () => {
      console.log('Fetching product prices from Supabase...');
      try {
        const { data, error } = await supabase
          .from('product_prices')
          .select('*')
          .order('product_name');
          
        if (error) {
          console.error('Error fetching product prices:', error);
          throw error;
        }
        
        console.log('Product prices fetched:', data);
        return data as ProductPrice[];
      } catch (err) {
        console.error('Exception when fetching product prices:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false
  });

  // Wrap the refetch function to return Promise<void> instead of Promise<QueryObserverResult>
  const refetch = async (): Promise<void> => {
    try {
      await reactQueryRefetch();
      return;
    } catch (error) {
      console.error('Error refetching product prices:', error);
      return;
    }
  };

  // Organize products by name for easier lookup
  const productPricesByName = productPrices.reduce((acc, product) => {
    acc[product.product_name] = product;
    return acc;
  }, {} as Record<string, ProductPrice>);

  return { 
    productPrices, 
    productPricesByName,
    isLoading, 
    error, 
    refetch 
  };
}
