
import { useState } from 'react';
import { useAnalysisItemsQuery } from './analysis/useAnalysisItemsQuery';
import { useAddToAnalysis } from './analysis/useAddToAnalysis';
import { useUpdateAnalysisItem } from './analysis/useUpdateAnalysisItem';
import { useUpdateSKUPrices } from './analysis/useUpdateSKUPrices';
import { type AnalysisItem } from '@/types/analysisItem';

export { type AnalysisItem } from '@/types/analysisItem';

export function useAnalysisItems() {
  // Use our custom hooks to fetch and manipulate data
  const { analysisItems, isLoading, error, refetch } = useAnalysisItemsQuery();
  const { addToAnalysis } = useAddToAnalysis();
  const { updateAnalysisItem } = useUpdateAnalysisItem();
  const { updateSKUPrices } = useUpdateSKUPrices();
  
  // Track if an item is currently being deleted
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  return { 
    analysisItems, 
    isLoading, 
    error, 
    refetch,
    addToAnalysis,
    updateAnalysisItem,
    updateSKUPrices,
    isDeletingItem,
    setIsDeletingItem
  };
}
