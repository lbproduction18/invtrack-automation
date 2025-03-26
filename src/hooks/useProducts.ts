
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type Product, type PriorityLevel } from '@/types/product';

export function useProducts(statusFilter: string = 'low_stock') {
  const { toast } = useToast();

  // Fetch products using react-query
  const { 
    data: products = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['products', statusFilter],
    queryFn: async () => {
      console.log(`Fetching products from Supabase with status: ${statusFilter}...`);
      try {
        const query = supabase
          .from('Low stock product')
          .select(`
            id,
            SKU,
            product_name,
            current_stock,
            threshold,
            created_at,
            updated_at,
            priority_badge,
            note,
            price_1000,
            price_2000,
            price_3000,
            price_4000,
            price_5000,
            last_order_quantity,
            last_order_date,
            lab_status,
            estimated_delivery_date,
            status
          `)
          .order('SKU');
          
        // Apply status filter if specified
        if (statusFilter !== 'all') {
          query.eq('status', statusFilter);
        }
        
        const { data, error } = await query;
          
        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
        
        console.log('Products fetched:', data);
        // Ensure the priority_badge is of type PriorityLevel
        const typedData = data.map(item => ({
          ...item,
          priority_badge: item.priority_badge as PriorityLevel
        }));
        
        return typedData;
      } catch (err) {
        console.error('Exception when fetching products:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (error) {
      console.error('Error in products query:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  return { products, isLoading, error, refetch };
}
