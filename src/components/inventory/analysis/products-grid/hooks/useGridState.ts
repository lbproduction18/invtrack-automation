
import { useState } from 'react';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';

const useGridState = () => {
  const [selectedProduct, setSelectedProduct] = useState<AnalysisProduct | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  return {
    selectedProduct,
    isDetailDrawerOpen,
    expandedNoteId,
    setSelectedProduct,
    setIsDetailDrawerOpen,
    setExpandedNoteId
  };
};

export default useGridState;
