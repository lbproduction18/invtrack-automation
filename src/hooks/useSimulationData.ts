
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SimulationSession {
  id: string;
  created_at: string;
  budget: number;
  status: string;
  notes: string | null;
}

export interface SimulationScenario {
  id: string;
  simulation_id: string;
  name: string;
  total_cost: number;
  total_skus: number;
  summary_comment: string;
  created_at: string;
}

export interface SimulationResult {
  id: string;
  scenario_id: string;
  sku_code: string;
  product_name: string;
  quantity: number;
  estimated_cost: number;
  ai_priority: boolean;
  comment: string | null;
}

export function useSimulationSessions() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['simulationSessions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('simulation_sessions')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          toast({
            title: 'Error fetching simulation sessions',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        
        return data as SimulationSession[];
      } catch (error) {
        console.error('Error in useSimulationSessions:', error);
        return [] as SimulationSession[];
      }
    }
  });
}

export function useSimulationScenarios(simulationId: string | null) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['simulationScenarios', simulationId],
    queryFn: async () => {
      if (!simulationId) return [];
      
      try {
        const { data, error } = await supabase
          .from('simulation_scenarios')
          .select('*')
          .eq('simulation_id', simulationId)
          .order('created_at', { ascending: true });
          
        if (error) {
          toast({
            title: 'Error fetching simulation scenarios',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        
        return data as SimulationScenario[];
      } catch (error) {
        console.error('Error in useSimulationScenarios:', error);
        return [] as SimulationScenario[];
      }
    },
    enabled: !!simulationId
  });
}

export function useSimulationResults(scenarioId: string | null) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['simulationResults', scenarioId],
    queryFn: async () => {
      if (!scenarioId) return [];
      
      try {
        const { data, error } = await supabase
          .from('simulation_results')
          .select('*')
          .eq('scenario_id', scenarioId);
          
        if (error) {
          toast({
            title: 'Error fetching simulation results',
            description: error.message,
            variant: 'destructive',
          });
          throw error;
        }
        
        return data as SimulationResult[];
      } catch (error) {
        console.error('Error in useSimulationResults:', error);
        return [] as SimulationResult[];
      }
    },
    enabled: !!scenarioId
  });
}
