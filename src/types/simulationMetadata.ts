
/**
 * Interface for AI simulation metadata
 */
export interface AISimulationMetadata {
  id?: string;
  budget_max: number;
  ai_note: string;
  simulation_label: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_METADATA: AISimulationMetadata = {
  budget_max: 500000,
  ai_note: '',
  simulation_label: 'Default Simulation',
  status: 'pending'
};
