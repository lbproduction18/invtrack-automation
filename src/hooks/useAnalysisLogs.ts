
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalysisLogEntry {
  id: string;
  action_type: string;
  sku_code: string | null;
  product_name: string | null;
  user_id: string | null;
  created_at: string;
  note: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
}

export interface LogsFilter {
  startDate: Date | null;
  endDate: Date | null;
  actionType: string | null;
  searchTerm: string | null;
}

export function useAnalysisLogs(filters: LogsFilter = { 
  startDate: null, 
  endDate: null, 
  actionType: null, 
  searchTerm: null 
}) {
  const { toast } = useToast();

  const fetchLogs = async () => {
    let query = supabase
      .from('analysis_items_logs')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply date filters
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }
    
    if (filters.endDate) {
      // Add one day to include the end date fully
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt('created_at', endDate.toISOString());
    }

    // Apply action type filter
    if (filters.actionType) {
      query = query.eq('action_type', filters.actionType);
    }

    // Apply search term filter (on product_name or sku_code)
    if (filters.searchTerm) {
      query = query.or(`product_name.ilike.%${filters.searchTerm}%,sku_code.ilike.%${filters.searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analysis logs:', error);
      toast({
        title: 'Error fetching logs',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }

    return data as AnalysisLogEntry[];
  };

  const { 
    data: logs = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['analysisLogs', filters],
    queryFn: fetchLogs
  });

  return {
    logs,
    isLoading,
    error,
    refetch
  };
}
