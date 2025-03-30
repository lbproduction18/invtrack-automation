
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
  price_1000: number | null;
  price_2000: number | null;
  price_3000: number | null;
  price_4000: number | null;
  price_5000: number | null;
  price_8000: number | null;
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
      
      // Get product details to include SKU information
      const { data: productDetails, error: detailsError } = await supabase
        .from('Low stock product')
        .select('id, SKU, product_name')
        .in('id', productIds);
        
      if (detailsError) {
        throw detailsError;
      }
      
      // Then create analysis items with SKU information but NO pricing data yet
      const analysisItems = productIds.map(id => {
        const product = productDetails.find(p => p.id === id);
        return {
          product_id: id,
          quantity_selected: null,
          last_order_info: null,
          lab_status_text: null,
          last_order_date: null,
          sku_code: product?.SKU || null,
          sku_label: product?.product_name || null,
          weeks_delivery: null
          // Removed price fields - will be added later with the update prices button
        };
      });
      
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
    onSuccess: (data) => {
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
      console.log('Analysis item updated successfully:', data);
      
      // Show success toast for user feedback
      toast({
        title: "Mise à jour réussie",
        description: "Les données d'analyse ont été mises à jour avec succès.",
      });
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

  // Add a new function to update prices for all selected SKUs
  const updateSKUPrices = useMutation({
    mutationFn: async (analysisItemsWithPrices: Partial<AnalysisItem>[]) => {
      console.log('Updating prices for analysis items:', analysisItemsWithPrices);
      
      // Use Promise.all to update all items in parallel
      const updates = analysisItemsWithPrices.map(async (item) => {
        if (!item.id) return null;
        
        const { data, error } = await supabase
          .from('analysis_items')
          .update({
            price_1000: item.price_1000,
            price_2000: item.price_2000,
            price_3000: item.price_3000,
            price_4000: item.price_4000,
            price_5000: item.price_5000,
            price_8000: item.price_8000
          })
          .eq('id', item.id)
          .select();
          
        if (error) {
          console.error(`Error updating prices for item ${item.id}:`, error);
          throw error;
        }
        
        return data;
      });
      
      const results = await Promise.all(updates);
      return results.filter(Boolean);
    },
    onSuccess: () => {
      // Invalidate the queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
      
      // Show success toast
      toast({
        title: "Prix mis à jour",
        description: "Les prix des SKUs sélectionnés ont été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error updating prices:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les prix. Veuillez réessayer.",
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
    updateAnalysisItem,
    updateSKUPrices
  };
}
