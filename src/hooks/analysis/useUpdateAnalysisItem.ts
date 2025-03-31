
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AnalysisItem } from '@/types/analysisItem';

export function useUpdateAnalysisItem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateAnalysisItem = useMutation({
    mutationFn: async (params: { id: string, data: Partial<AnalysisItem> }) => {
      const { id, data } = params;
      
      // Get the current state of the analysis item before update
      const { data: currentItem, error: fetchError } = await supabase
        .from('analysis_items')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Update the analysis item
      const { data: updatedItem, error: updateError } = await supabase
        .from('analysis_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) {
        throw updateError;
      }
      
      // Create a log entry if stock, threshold, or last_order_date are being updated
      if (data.stock !== undefined || data.threshold !== undefined || data.last_order_date !== undefined) {
        const logEntry = {
          sku_code: updatedItem.sku_code,
          stock: data.stock ?? currentItem.stock,
          threshold: data.threshold ?? currentItem.threshold,
          last_order_date: data.last_order_date ?? currentItem.last_order_date
        };
        
        const { error: logError } = await supabase
          .from('analysis_log')
          .insert(logEntry);
          
        if (logError) {
          console.error('Error creating log entry:', logError);
          // Don't throw here - we'll still return the updated item even if logging fails
        }
      }
      
      return updatedItem;
    },
    onSuccess: () => {
      toast({
        title: "Produit mis à jour",
        description: "Les modifications ont été enregistrées avec succès."
      });
      
      // Invalidate the analysisItems query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
    },
    onError: (error) => {
      console.error('Error updating analysis item:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  return { updateAnalysisItem };
}
