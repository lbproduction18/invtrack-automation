
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
      
      // Note: We've removed the analysis_log code as that table does not exist anymore
      
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
