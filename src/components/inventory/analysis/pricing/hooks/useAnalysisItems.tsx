
import { useState, useEffect } from 'react';
import { AnalysisItem } from '@/types/analysisItem';
import { supabase } from '@/integrations/supabase/client';

export function useAnalysisItems(analysisItems: AnalysisItem[]) {
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshedAnalysisItems, setRefreshedAnalysisItems] = useState<AnalysisItem[]>(analysisItems);

  // Fetch the latest data from the analysis_items table to ensure we have the most up-to-date quantities
  const refreshAnalysisItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('analysis_items')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching updated analysis items:', error);
      } else if (data) {
        // Convert the raw data to the AnalysisItem type with proper defaults
        const itemsWithDefaults: AnalysisItem[] = data.map(item => ({
          id: item.id,
          product_id: item.product_id || '',
          quantity_selected: item.quantity_selected,
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          status: item.status || '',
          last_order_info: item.last_order_info,
          lab_status_text: item.lab_status_text,
          last_order_date: item.last_order_date,
          weeks_delivery: item.weeks_delivery,
          sku_code: item.sku_code,
          sku_label: item.sku_label,
          price_1000: item.price_1000,
          price_2000: item.price_2000,
          price_3000: item.price_3000,
          price_4000: item.price_4000,
          price_5000: item.price_5000,
          price_8000: item.price_8000,
          stock: item.stock,
          threshold: item.threshold,
          // Add optional properties with default values
          note: null,
          priority_badge: null,
          date_added: null
        }));
        
        setRefreshedAnalysisItems(itemsWithDefaults);
      }
    } catch (err) {
      console.error('Exception when fetching analysis items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when the component mounts or when switching to this tab
  useEffect(() => {
    refreshAnalysisItems();
  }, []);

  // When the analysisItems prop changes (due to updates elsewhere), refresh our local state
  useEffect(() => {
    setRefreshedAnalysisItems(analysisItems);
  }, [analysisItems]);

  return {
    loading,
    refreshedAnalysisItems,
    refreshAnalysisItems
  };
}
