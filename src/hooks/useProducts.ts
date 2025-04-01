
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type Product, type PriorityLevel, type DatabasePriorityLevel } from '@/types/product';

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
        
        // Map database priority values to our frontend PriorityLevel type
        const typedData = data.map(item => {
          let priorityBadge: PriorityLevel = item.priority_badge as DatabasePriorityLevel;
          
          // Add any additional mapping logic if needed here
          // For now, we're just ensuring the type is correctly mapped
          
          return {
            ...item,
            priority_badge: priorityBadge,
            // Set default value for weeks_delivery since it's not in the query
            weeks_delivery: null
          } as Product;
        });
        
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
