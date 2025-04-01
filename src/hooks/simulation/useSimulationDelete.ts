
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AISimulationMetadata } from '@/types/simulationMetadata';

/**
 * Hook for deleting simulation metadata
 */
export function useSimulationDelete() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const deleteMetadata = useMutation({
    mutationFn: async (metadata: AISimulationMetadata | undefined) => {
      try {
        if (metadata?.id) {
          const { error } = await supabase
            .from('ai_simulation_metadata')
            .delete()
            .eq('id', metadata.id);

          if (error) {
            console.error('Error deleting AI simulation metadata:', error);
            throw error;
          }
          
          return { success: true };
        } else {
          const { data: latestData, error: fetchError } = await supabase
            .from('ai_simulation_metadata')
            .select('id')
            .order('created_at', { ascending: false })
            .limit(1);

          if (fetchError) {
            console.error('Error fetching latest AI simulation metadata:', fetchError);
            throw fetchError;
          }

          if (latestData && latestData.length > 0) {
            const latestId = latestData[0].id;
            const { error } = await supabase
              .from('ai_simulation_metadata')
              .delete()
              .eq('id', latestId);

            if (error) {
              console.error('Error deleting AI simulation metadata:', error);
              throw error;
            }
            
            return { success: true };
          }
          
          return { success: false, reason: 'No records found' };
        }
      } catch (err) {
        console.error('Exception when deleting AI simulation metadata:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['aiSimulationMetadata']
      });
      toast({
        title: "Simulation réinitialisée",
        description: "Les paramètres de simulation AI ont été supprimés."
      });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les paramètres de simulation.",
        variant: "destructive"
      });
    }
  });

  return { deleteMetadata };
}
