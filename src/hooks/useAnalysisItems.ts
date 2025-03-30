
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
  last_order_info: string | null;
  lab_status_text: string | null;
  last_order_date: string | null;
  weeks_delivery: string | null; 
  sku_code: string | null;
  sku_label: string | null;
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
        quantity_selected: null,
        last_order_info: null,
        lab_status_text: null,
        last_order_date: null,
        sku_code: null,
        sku_label: null,
        weeks_delivery: null
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

  // Update analysis item
  const updateAnalysisItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<AnalysisItem> }) => {
      console.log(`Updating analysis item ${id} with:`, updates);
      
      const { data, error } = await supabase
        .from('analysis_items')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) {
        console.error('Error updating analysis item:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
    },
    onError: (error) => {
      console.error('Error updating analysis item:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'analyse. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  return { 
    analysisItems, 
    isLoading, 
    error, 
    refetch,
    addToAnalysis,
    updateAnalysisItem
  };
}
