
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
      
      // Get complete product details to include all relevant information
      const { data: productDetails, error: detailsError } = await supabase
        .from('Low stock product')
        .select('id, SKU, product_name, current_stock, threshold, created_at, note, priority_badge, last_order_date, last_order_quantity')
        .in('id', productIds);
        
      if (detailsError) {
        throw detailsError;
      }
      
      // Create analysis items with all available information from Step 1
      const analysisItems = productIds.map(id => {
        const product = productDetails.find(p => p.id === id);
        return {
          product_id: id,
          quantity_selected: null,
          last_order_info: product?.last_order_quantity ? `${product.last_order_quantity}` : null,
          lab_status_text: null,
          sku_code: product?.SKU || null,
          sku_label: product?.product_name || null,
          weeks_delivery: null,
          // Add these fields related to stock info
          stock: product?.current_stock || null,
          threshold: product?.threshold || null,
          last_order_date: product?.last_order_date || null,
          // Include price fields as null for now
          price_1000: null,
          price_2000: null,
          price_3000: null,
          price_4000: null,
          price_5000: null,
          price_8000: null,
          // Add the note and priority_badge from Step 1
          note: product?.note || null,
          priority_badge: product?.priority_badge || null,
          date_added: product?.created_at || null
        };
      });
      
      console.log('Analysis items to insert:', analysisItems);
      
      // Insert into analysis_items
      const { data, error } = await supabase
        .from('analysis_items')
        .insert(analysisItems)
        .select();
        
      if (error) {
        console.error('Error inserting analysis items:', error);
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
