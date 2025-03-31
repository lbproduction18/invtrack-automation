
import { useState, useEffect } from 'react';
import { AnalysisItem } from '@/types/analysisItem';
import { supabase } from '@/integrations/supabase/client';

export function useAnalysisItems(initialItems: AnalysisItem[] = []) {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshedAnalysisItems, setRefreshedAnalysisItems] = useState<AnalysisItem[]>(initialItems);

  useEffect(() => {
    // Set initial items immediately
    if (initialItems && initialItems.length > 0) {
      setRefreshedAnalysisItems(initialItems);
    }
    
    // Then fetch fresh data
    fetchAnalysisItems();
  }, [initialItems]);

  const fetchAnalysisItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('analysis_items')
        .select('*');
        
      if (error) {
        console.error('Error fetching analysis items:', error);
        return;
      }
      
      if (data) {
        setRefreshedAnalysisItems(data as AnalysisItem[]);
      }
    } catch (err) {
      console.error('Exception fetching analysis items:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    refreshedAnalysisItems,
    refreshItems: fetchAnalysisItems
  };
}
