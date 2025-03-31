import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisItem } from "@/types/analysis";

export const useUpdateAnalysisItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      data: updates 
    }: { 
      id: string; 
      data: Partial<AnalysisItem>;
    }) => {
      // Make sure we don't try to update the id itself
      const { id: _, ...updateData } = updates;
      
      // Get the current state of the item before updating
      const { data: currentItem, error: fetchError } = await supabase
        .from('analysis_items')
        .select()
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Perform the update
      const { data, error } = await supabase
        .from('analysis_items')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // No longer logging to analysis_log - removed that functionality

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
      
      toast({
        title: "Produit mis à jour",
        description: "Les modifications ont été enregistrées avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating analysis item:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la mise à jour du produit."
      });
    }
  });
};
