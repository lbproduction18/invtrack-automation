
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SimulationMetadata, CreateSimulationMetadata } from '@/types/simulationMetadata';

export function useSimulationMetadata() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentSimulation, setCurrentSimulation] = useState<string | null>(null);

  // Fetch all simulations
  const { 
    data: simulations = [], 
    isLoading: isLoadingSimulations,
    error: simulationsError,
    refetch: refetchSimulations
  } = useQuery({
    queryKey: ['simulations'],
    queryFn: async () => {
      console.log('Fetching simulations from Supabase...');
      try {
        const { data, error } = await supabase
          .from('ai_simulation_metadata')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching simulations:', error);
          throw error;
        }
        
        console.log('Simulations fetched:', data);
        return data as SimulationMetadata[];
      } catch (err) {
        console.error('Exception when fetching simulations:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false
  });

  // Fetch a specific simulation by ID
  const fetchSimulationById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_simulation_metadata')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching simulation:', error);
        throw error;
      }
      
      console.log('Simulation fetched:', data);
      return data as SimulationMetadata;
    } catch (err) {
      console.error('Exception when fetching simulation:', err);
      throw err;
    }
  };

  // Create a new simulation
  const createSimulation = useMutation({
    mutationFn: async (data: Partial<CreateSimulationMetadata>) => {
      console.log('Creating new simulation with data:', data);
      try {
        const { data: newSimulation, error } = await supabase
          .from('ai_simulation_metadata')
          .insert([data])
          .select()
          .single();
          
        if (error) {
          console.error('Error creating simulation:', error);
          throw error;
        }
        
        console.log('New simulation created:', newSimulation);
        setCurrentSimulation(newSimulation.id);
        return newSimulation as SimulationMetadata;
      } catch (err) {
        console.error('Exception when creating simulation:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: "Simulation créée",
        description: "Nouvelle simulation créée avec succès."
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
    onError: (error) => {
      console.error('Error creating simulation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la simulation.",
        variant: "destructive"
      });
    }
  });

  // Update an existing simulation
  const updateSimulation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SimulationMetadata>) => {
      console.log('Updating simulation with ID:', id);
      console.log('Updates:', updates);
      
      try {
        const { data: updatedSimulation, error } = await supabase
          .from('ai_simulation_metadata')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating simulation:', error);
          throw error;
        }
        
        console.log('Simulation updated:', updatedSimulation);
        return updatedSimulation as SimulationMetadata;
      } catch (err) {
        console.error('Exception when updating simulation:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: "Simulation mise à jour",
        description: "La simulation a été mise à jour avec succès."
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      if (currentSimulation) {
        queryClient.invalidateQueries({ queryKey: ['simulation', currentSimulation] });
      }
    },
    onError: (error) => {
      console.error('Error updating simulation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la simulation.",
        variant: "destructive"
      });
    }
  });

  // Connect analysis items to a simulation
  const connectAnalysisItemsToSimulation = useMutation({
    mutationFn: async ({ simulationId, analysisItemIds }: { simulationId: string, analysisItemIds: string[] }) => {
      console.log('Connecting analysis items to simulation:', simulationId);
      console.log('Analysis item IDs:', analysisItemIds);
      
      try {
        const { error } = await supabase
          .from('analysis_items')
          .update({ simulation_id: simulationId })
          .in('id', analysisItemIds);
          
        if (error) {
          console.error('Error connecting analysis items:', error);
          throw error;
        }
        
        console.log('Analysis items connected to simulation:', simulationId);
        return { success: true };
      } catch (err) {
        console.error('Exception when connecting analysis items:', err);
        throw err;
      }
    },
    onSuccess: () => {
      toast({
        title: "Éléments connectés",
        description: "Les éléments d'analyse ont été connectés à la simulation."
      });
      
      // Invalidate analysis items query
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
    },
    onError: (error) => {
      console.error('Error connecting analysis items:', error);
      toast({
        title: "Erreur",
        description: "Impossible de connecter les éléments à la simulation.",
        variant: "destructive"
      });
    }
  });

  return {
    simulations,
    isLoadingSimulations,
    simulationsError,
    currentSimulation,
    setCurrentSimulation,
    fetchSimulationById,
    createSimulation,
    updateSimulation,
    connectAnalysisItemsToSimulation,
    refetchSimulations
  };
}
