
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
      
      console.log('Updating analysis item with data:', data);
      
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
      
      return updatedItem;
    },
    onSuccess: (data, variables) => {
      // Check if the update was for a note
      const isNoteUpdate = 'note' in variables.data;
      
      // Show different toast messages depending on what was updated
      if (isNoteUpdate) {
        toast({
          title: "Note mise à jour",
          description: "La note a été enregistrée avec succès."
        });
      } else {
        toast({
          title: "Produit mis à jour",
          description: "Les modifications ont été enregistrées avec succès."
        });
      }
      
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
