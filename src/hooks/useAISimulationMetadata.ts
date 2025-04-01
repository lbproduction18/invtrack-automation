
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
// Replace the old import with a nanoid generation function
import { nanoid } from 'nanoid';

// Define interface for AISimulationMetadata
interface AISimulationMetadata {
  id?: string;
  budget_max: number;
  ai_note: string;
  simulation_label: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Default metadata values
const DEFAULT_METADATA: AISimulationMetadata = {
  budget_max: 500000,
  ai_note: '',
  simulation_label: 'Default Simulation',
  status: 'pending'
};

export function useAISimulationMetadata() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch the latest simulation metadata
  const { data: metadata, isLoading, error, refetch } = useQuery({
    queryKey: ['aiSimulationMetadata'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ai_simulation_metadata')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error fetching AI simulation metadata:', error);
          throw error;
        }

        // Return the first record or default values if no records found
        return data && data.length > 0 ? data[0] as AISimulationMetadata : DEFAULT_METADATA;
      } catch (err) {
        console.error('Exception when fetching AI simulation metadata:', err);
        throw err;
      }
    }
  });

  // Create new simulation metadata
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

  // Update existing simulation metadata
  const updateMetadata = useMutation({
    mutationFn: async (updatedMetadata: Partial<AISimulationMetadata>) => {
      if (!metadata?.id) {
        // If no record exists yet, create one instead
        return createMetadata.mutateAsync(updatedMetadata);
      }

      try {
        const { data, error } = await supabase
          .from('ai_simulation_metadata')
          .update({
            ...updatedMetadata,
            updated_at: new Date().toISOString()
          })
          .eq('id', metadata.id)
          .select();

        if (error) {
          console.error('Error updating AI simulation metadata:', error);
          throw error;
        }

        return data?.[0] as AISimulationMetadata;
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

  // Save metadata (create or update)
  const saveMetadata = async (data: Partial<AISimulationMetadata>) => {
    if (!metadata?.id) {
      return createMetadata.mutateAsync(data);
    } else {
      return updateMetadata.mutateAsync(data);
    }
  };

  return {
    metadata: metadata || DEFAULT_METADATA,
    isLoading,
    isCreating,
    error,
    saveMetadata,
    refetch
  };
}
