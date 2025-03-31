
import { useState, useEffect } from 'react';
import { AnalysisItem } from '@/types/analysisItem';

interface UseAnalysisItemsResult {
  loading: boolean;
  refreshedAnalysisItems: AnalysisItem[];
}

export function useAnalysisItems(analysisItems: AnalysisItem[]): UseAnalysisItemsResult {
  const [loading, setLoading] = useState(false);
  const [refreshedAnalysisItems, setRefreshedAnalysisItems] = useState<AnalysisItem[]>([]);

  useEffect(() => {
    // Filter analysis items that have SKU information and quantity
    const validItems = analysisItems.filter(
      item => item.sku_code || item.quantity_selected
    );
    
    setRefreshedAnalysisItems(validItems);
  }, [analysisItems]);

  return {
    loading,
    refreshedAnalysisItems
  };
}
