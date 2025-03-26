
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type Product } from '@/types/product';

export interface AnalysisItem {
  id: string;
  product_id: string;
  quantity_selected: number | null;
  created_at: string;
  updated_at: string;
  status: string;
}

export function useAnalysisItems() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analysis items
  const { 
    data: analysisItems = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['analysisItems'],
    queryFn: async () => {
      console.log('Fetching analysis items from Supabase...');
      try {
        const { data, error } = await supabase
          .from('analysis_items')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching analysis items:', error);
          throw error;
        }
        
        console.log('Analysis items fetched:', data);
        return data;
      } catch (err) {
        console.error('Exception when fetching analysis items:', err);
        throw err;
      }
    }
  });

  // Add products to analysis
  const addToAnalysis = useMutation({
    mutationFn: async (productIds: string[]) => {
      // First, update the product status
      const { error: productError } = await supabase
        .from('Low stock product')
        .update({ status: 'analysis' })
        .in('id', productIds);
        
      if (productError) {
        throw productError;
      }
      
      // Then create analysis items
      const analysisItems = productIds.map(id => ({
        product_id: id,
        quantity_selected: null
      }));
      
      const { data, error } = await supabase
        .from('analysis_items')
        .insert(analysisItems)
        .select();
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Produits ajoutés à l'analyse",
        description: "Les produits ont été transférés avec succès.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
    },
    onError: (error) => {
      console.error('Error adding to analysis:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les produits à l'analyse. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  return { 
    analysisItems, 
    isLoading, 
    error, 
    refetch,
    addToAnalysis
  };
}
