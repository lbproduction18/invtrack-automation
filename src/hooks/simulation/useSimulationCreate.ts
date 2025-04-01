
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AISimulationMetadata, DEFAULT_METADATA } from '@/types/simulationMetadata';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { useState } from 'react';

/**
 * Hook for creating simulation metadata
 */
export function useSimulationCreate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  
  const createMetadata = useMutation({
    mutationFn: async (newMetadata: Partial<AISimulationMetadata>) => {
      setIsCreating(true);
      try {
        const completeMetadata: AISimulationMetadata = {
          id: nanoid(),
          ...DEFAULT_METADATA,
          ...newMetadata,
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('ai_simulation_metadata')
          .insert(completeMetadata)
          .select();

        if (error) {
          console.error('Error creating AI simulation metadata:', error);
          throw error;
        }

        return data?.[0] as AISimulationMetadata;
      } catch (err) {
        console.error('Exception when creating AI simulation metadata:', err);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['aiSimulationMetadata']
      });
      toast({
        title: "Configuration de simulation sauvegardée",
        description: "Les paramètres de simulation AI ont été enregistrés."
      });
      return data;
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de simulation.",
        variant: "destructive"
      });
    }
  });

  return { createMetadata, isCreating };
}
