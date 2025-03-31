
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
        // Mock data for simulation sessions since the table doesn't exist yet
        return [
          {
            id: 'mock-session-1',
            created_at: new Date().toISOString(),
            budget: 300000,
            status: 'completed',
            notes: 'Example simulation session'
          }
        ] as SimulationSession[];
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
        // Mock data for simulation scenarios
        return [
          {
            id: 'mock-scenario-1',
            simulation_id: simulationId,
            name: 'Conservative',
            total_cost: 150000,
            total_skus: 15,
            summary_comment: 'This conservative approach focuses on essential products with proven sales history.',
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-scenario-2',
            simulation_id: simulationId,
            name: 'Balanced',
            total_cost: 250000,
            total_skus: 25,
            summary_comment: 'A balanced approach that includes both essential products and some new promising SKUs.',
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-scenario-3',
            simulation_id: simulationId,
            name: 'Aggressive',
            total_cost: 300000,
            total_skus: 35,
            summary_comment: 'An aggressive strategy that maximizes SKU diversity and introduces several new product lines.',
            created_at: new Date().toISOString()
          }
        ] as SimulationScenario[];
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
        // Mock data for simulation results
        return [
          {
            id: 'mock-result-1',
            scenario_id: scenarioId,
            sku_code: 'COLLAGENE-LOTUS',
            product_name: 'Collagene Lotus',
            quantity: 3000,
            estimated_cost: 28500,
            ai_priority: true,
            comment: 'High margin product with consistent sales history'
          },
          {
            id: 'mock-result-2',
            scenario_id: scenarioId,
            sku_code: 'ACIDE-CITRIQUE',
            product_name: 'Acide Citrique',
            quantity: 2000,
            estimated_cost: 15750,
            ai_priority: false,
            comment: 'Standard restock based on historical demand'
          },
          {
            id: 'mock-result-3',
            scenario_id: scenarioId,
            sku_code: 'VITAMINE-E',
            product_name: 'Vitamine E',
            quantity: 1000,
            estimated_cost: 12800,
            ai_priority: true,
            comment: 'Essential ingredient with increasing demand'
          }
        ] as SimulationResult[];
      } catch (error) {
        console.error('Error in useSimulationResults:', error);
        return [] as SimulationResult[];
      }
    },
    enabled: !!scenarioId
  });
}
