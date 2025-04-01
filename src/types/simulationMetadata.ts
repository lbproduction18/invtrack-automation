
/**
 * Interface representing a simulation metadata record from the AI simulation
 */
export interface SimulationMetadata {
  id: string;
  created_at: string;
  updated_at: string;
  budget_max: number;
  ai_notes: string | null;
  user_id: string | null;
  status: 'pending' | 'running' | 'completed';
  simulation_name: string | null;
}

/**
 * Type for creating a new simulation
 */
export type CreateSimulationMetadata = Omit<SimulationMetadata, 'id' | 'created_at' | 'updated_at'>;
