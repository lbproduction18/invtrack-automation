
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface AISimulationMetadata {
  id: string;
  created_at: string;
  updated_at: string;
  budget_max: number;
  ai_note: string | null;
  user_id: string | null;
  simulation_label: string | null;
  status: string;
}

// Default values for a new simulation
export const DEFAULT_SIMULATION_METADATA: Partial<AISimulationMetadata> = {
  budget_max: 500000,
  ai_note: null,
  simulation_label: null,
  status: 'pending'
};

export function useAISimulationMetadata(simulationId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current simulation metadata
  const {
    data: metadata,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['aiSimulationMetadata', simulationId],
    queryFn: async () => {
      console.log('Fetching AI simulation metadata...');
      
      if (simulationId) {
        // Fetch specific simulation
        const { data, error } = await supabase
          .from('ai_simulation_metadata')
          .select('*')
          .eq('id', simulationId)
          .single();
          
        if (error) {
          console.error('Error fetching AI simulation metadata:', error);
          return DEFAULT_SIMULATION_METADATA;
        }
        
        return data as AISimulationMetadata;
      } else {
        // Get the most recent simulation or return defaults
        const { data, error } = await supabase
          .from('ai_simulation_metadata')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error || !data) {
          console.log('No existing simulation found, using defaults');
          return DEFAULT_SIMULATION_METADATA;
        }
        
        return data as AISimulationMetadata;
      }
    },
    enabled: true // Always fetch the latest simulation metadata
  });

  // Create a new simulation
  const createSimulation = useMutation({
    mutationFn: async (data: Partial<AISimulationMetadata> = {}) => {
      const newSimulation = {
        ...DEFAULT_SIMULATION_METADATA,
        ...data
      };
      
      console.log('Creating new AI simulation:', newSimulation);
      
      const { data: result, error } = await supabase
        .from('ai_simulation_metadata')
        .insert([newSimulation])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating simulation:', error);
        throw error;
      }
      
      return result as AISimulationMetadata;
    },
    onSuccess: (data) => {
      toast({
        title: "Simulation créée",
        description: "Une nouvelle simulation a été initiée."
      });
      queryClient.invalidateQueries({ queryKey: ['aiSimulationMetadata'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la simulation.",
        variant: "destructive"
      });
    }
  });

  // Update an existing simulation
  const updateSimulation = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string, 
      updates: Partial<AISimulationMetadata> 
    }) => {
      console.log(`Updating simulation ${id} with:`, updates);
      
      const { data, error } = await supabase
        .from('ai_simulation_metadata')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating simulation:', error);
        throw error;
      }
      
      return data as AISimulationMetadata;
    },
    onSuccess: () => {
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de simulation ont été mis à jour."
      });
      queryClient.invalidateQueries({ queryKey: ['aiSimulationMetadata'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres.",
        variant: "destructive"
      });
    }
  });

  // Update the current simulation metadata or create a new one if it doesn't exist
  const saveSimulationSettings = async (updates: Partial<AISimulationMetadata>) => {
    if (metadata?.id) {
      return updateSimulation.mutateAsync({ 
        id: metadata.id,
        updates
      });
    } else {
      return createSimulation.mutateAsync(updates);
    }
  };

  return {
    metadata: metadata || DEFAULT_SIMULATION_METADATA as AISimulationMetadata,
    isLoading,
    error,
    refetch,
    createSimulation,
    updateSimulation,
    saveSimulationSettings
  };
}
