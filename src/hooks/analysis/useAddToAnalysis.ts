
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

  return { addToAnalysis };
}
