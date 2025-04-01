
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AISimulationMetadata, DEFAULT_METADATA } from '@/types/simulationMetadata';

/**
 * Hook to fetch AI simulation metadata
 */
export function useSimulationQuery() {
  const query = useQuery({
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

        return data && data.length > 0 ? data[0] as AISimulationMetadata : DEFAULT_METADATA;
      } catch (err) {
        console.error('Exception when fetching AI simulation metadata:', err);
        throw err;
      }
    }
  });

  return query;
}
