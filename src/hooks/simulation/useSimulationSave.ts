
import { supabase } from '@/integrations/supabase/client';
import { AISimulationMetadata } from '@/types/simulationMetadata';
import { useSimulationCreate } from './useSimulationCreate';
import { useSimulationUpdate } from './useSimulationUpdate';

/**
 * Hook for saving simulation settings (create or update)
 */
export function useSimulationSave() {
  const { createMetadata } = useSimulationCreate();
  const { updateMetadata } = useSimulationUpdate();

  const saveSimulationSettings = async (
    data: Partial<AISimulationMetadata>, 
    currentMetadata: AISimulationMetadata | undefined
  ) => {
    // Check if there's any existing metadata row in Supabase
    const { data: existingData, error: checkError } = await supabase
      .from('ai_simulation_metadata')
      .select('count')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existence of metadata:', checkError);
      throw checkError;
    }
    
    const hasExistingRecord = existingData && existingData.length > 0;
    
    if (hasExistingRecord) {
      // If a record exists, update it
      return updateMetadata.mutateAsync({
        updatedMetadata: data,
        currentMetadata
      });
    } else {
      // If no record exists (e.g., after deletion), create a new one
      return createMetadata.mutateAsync(data);
    }
  };

  return { saveSimulationSettings };
}
