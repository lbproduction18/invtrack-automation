
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export function useLastUpdated() {
  const { toast } = useToast();

  const { 
    data: lastUpdated, 
    isLoading: isLoadingLastUpdated 
  } = useQuery({
    queryKey: ['last-update-time'],
    queryFn: async () => {
      console.log('Fetching last update time from Supabase...');
      try {
        const { data, error } = await supabase
          .from('low_stock_last_updated')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) {
          console.error('Error fetching last update time:', error);
          throw error;
        }
        
        console.log('Last update time fetched:', data);
        return data;
      } catch (err) {
        console.error('Exception when fetching last update time:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: true
  });

  // Format the last update time in a human-readable format
  const formatLastUpdated = () => {
    if (isLoadingLastUpdated || !lastUpdated) return "Chargement...";
    
    try {
      const date = new Date(lastUpdated.updated_at);
      return `${format(date, 'dd MMMM yyyy')} à ${format(date, 'HH:mm')}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return "Date inconnue";
    }
  };

  return { lastUpdated, isLoadingLastUpdated, formatLastUpdated };
}
