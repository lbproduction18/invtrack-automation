
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AISimulationMetadata } from '@/types/simulationMetadata';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for updating simulation metadata
 */
export function useSimulationUpdate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateMetadata = useMutation({
    mutationFn: async ({updatedMetadata, currentMetadata}: 
      {updatedMetadata: Partial<AISimulationMetadata>, currentMetadata: AISimulationMetadata | undefined}) => {
      try {
        if (currentMetadata?.id) {
          const { data, error } = await supabase
            .from('ai_simulation_metadata')
            .update({
              ...updatedMetadata,
              updated_at: new Date().toISOString()
            })
            .eq('id', currentMetadata.id)
            .select();

          if (error) {
            console.error('Error updating AI simulation metadata:', error);
            throw error;
          }

          return data?.[0] as AISimulationMetadata;
        } else {
          const { data: latestData, error: fetchError } = await supabase
            .from('ai_simulation_metadata')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

          if (fetchError) {
            console.error('Error fetching latest AI simulation metadata:', fetchError);
            throw fetchError;
          }

          if (latestData && latestData.length > 0) {
            const latestRecord = latestData[0];
            const { data, error } = await supabase
              .from('ai_simulation_metadata')
              .update({
                ...updatedMetadata,
                updated_at: new Date().toISOString()
              })
              .eq('id', latestRecord.id)
              .select();

            if (error) {
              console.error('Error updating AI simulation metadata:', error);
              throw error;
            }

            return data?.[0] as AISimulationMetadata;
          } else {
            throw new Error('No record found to update');
          }
        }
      } catch (err) {
        console.error('Exception when updating AI simulation metadata:', err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['aiSimulationMetadata']
      });
      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de simulation AI ont été mis à jour."
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres de simulation.",
        variant: "destructive"
      });
    }
  });

  return { updateMetadata };
}
