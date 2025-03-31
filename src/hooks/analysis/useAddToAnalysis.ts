
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAddToAnalysis() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      
      // Get product details to include SKU information, stock, threshold, and last_order_date
      const { data: productDetails, error: detailsError } = await supabase
        .from('Low stock product')
        .select('id, SKU, product_name, current_stock, threshold, last_order_date')
        .in('id', productIds);
        
      if (detailsError) {
        throw detailsError;
      }
      
      // Create analysis items with SKU information and the new required fields
      const analysisItems = productIds.map(id => {
        const product = productDetails.find(p => p.id === id);
        return {
          product_id: id,
          quantity_selected: null,
          last_order_info: null,
          lab_status_text: null,
          sku_code: product?.SKU || null,
          sku_label: product?.product_name || null,
          weeks_delivery: null,
          // Add new fields from the product details
          stock: product?.current_stock || null,
          threshold: product?.threshold || null,
          last_order_date: product?.last_order_date || null
        };
      });
      
      // Insert into analysis_items
      const { data, error } = await supabase
        .from('analysis_items')
        .insert(analysisItems)
        .select();
        
      if (error) {
        throw error;
      }
      
      // Create log entries for tracking transitions
      const logEntries = productIds.map(id => {
        const product = productDetails.find(p => p.id === id);
        return {
          sku_code: product?.SKU || null,
          stock: product?.current_stock || null,
          threshold: product?.threshold || null,
          last_order_date: product?.last_order_date || null
        };
      });
      
      // Insert into analysis_log
      const { error: logError } = await supabase
        .from('analysis_log')
        .insert(logEntries);
        
      if (logError) {
        console.error('Error creating log entries:', logError);
        // Don't throw here - we'll still return the analysis items even if logging fails
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

  return { addToAnalysis };
}
