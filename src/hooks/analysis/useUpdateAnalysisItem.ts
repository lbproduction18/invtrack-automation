
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type AnalysisItem } from '@/types/analysisItem';

export function useUpdateAnalysisItem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return { updateAnalysisItem };
}
