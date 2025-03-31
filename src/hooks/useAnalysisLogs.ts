
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LogsFilter {
  startDate: Date | null;
  endDate: Date | null;
  actionType: string | null;
  searchTerm: string | null;
}

export interface AnalysisLog {
  id: string;
  created_at: string | null;
  action_type: string;
  sku_code: string | null;
  product_name: string | null;
  user_id: string | null;
  old_values: any | null;
  new_values: any | null;
  note: string | null;
}

export function useAnalysisLogs(filters: LogsFilter = {
  startDate: null,
  endDate: null,
  actionType: null,
  searchTerm: null
}) {
  const [logs, setLogs] = useState<AnalysisLog[]>([]);

  // Function to fetch logs
  const fetchLogs = async (): Promise<AnalysisLog[]> => {
    let query = supabase
      .from('analysis_items_logs')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }
    
    if (filters.endDate) {
      // Add one day to include the end date fully
      const nextDay = new Date(filters.endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.lte('created_at', nextDay.toISOString());
    }
    
    if (filters.actionType) {
      query = query.eq('action_type', filters.actionType);
    }
    
    if (filters.searchTerm) {
      query = query.or(`sku_code.ilike.%${filters.searchTerm}%,product_name.ilike.%${filters.searchTerm}%,note.ilike.%${filters.searchTerm}%`);
    }

    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching analysis logs:', error);
      return [];
    }
    
    return data as AnalysisLog[];
  };

  // Use react-query to handle the data fetching
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analysisLogs', filters],
    queryFn: fetchLogs
  });

  // Update logs when data changes
  useEffect(() => {
    if (data) {
      setLogs(data);
    }
  }, [data]);

  return { logs, isLoading, error, refetch };
}
