
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type Product } from '@/types/product';

export function useProducts() {
  const { toast } = useToast();

  // Fetch products using react-query
  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      try {
        const { data, error } = await supabase
          .from('Low stock product')
          .select(`
            id,
            name,
            description,
            unit
          `)
          .order('name');
          
        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
        
        console.log('Products fetched:', data);
        return data;
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

  return { products, isLoading, error };
}
