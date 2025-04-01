
import { useSimulationQuery } from './simulation/useSimulationQuery';
import { useSimulationSave } from './simulation/useSimulationSave';
import { useSimulationDelete } from './simulation/useSimulationDelete';
import { DEFAULT_METADATA } from '@/types/simulationMetadata';
import { useSimulationCreate } from './simulation/useSimulationCreate';

/**
 * Hook for managing AI simulation metadata
 */
export function useAISimulationMetadata() {
  const { data: metadata, isLoading, error, refetch } = useSimulationQuery();
  const { isCreating } = useSimulationCreate();
  const { saveSimulationSettings } = useSimulationSave();
  const { deleteMetadata } = useSimulationDelete();

  // Wrapper function that includes the current metadata in the save operation
  const saveSettings = async (data: Partial<typeof metadata>) => {
    return saveSimulationSettings(data, metadata);
  };

  return {
    metadata: metadata || DEFAULT_METADATA,
    isLoading,
    isCreating,
    error,
    saveSimulationSettings: saveSettings,
    deleteMetadata,
    refetch
  };
}
