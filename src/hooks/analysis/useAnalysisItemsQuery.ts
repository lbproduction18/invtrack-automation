
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { type AnalysisItem } from '@/types/analysisItem';
import { useToast } from '@/hooks/use-toast';

export function useAnalysisItemsQuery() {
  const { toast } = useToast();

  const { 
    data: analysisItems = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['analysisItems'],
    queryFn: async () => {
      console.log('Fetching analysis items from Supabase...');
      try {
        const { data, error } = await supabase
          .from('analysis_items')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching analysis items:', error);
          throw error;
        }
        
        console.log('Analysis items fetched:', data);
        return data as AnalysisItem[];
      } catch (err) {
        console.error('Exception when fetching analysis items:', err);
        throw err;
      }
    }
  });

  return { 
    analysisItems, 
    isLoading, 
    error, 
    refetch 
  };
}
