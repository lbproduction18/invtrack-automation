
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';
import ProductDetailDrawer from '../ProductDetailDrawer';
import AnalysisProductsTable from './AnalysisProductsTable';
import useGridState from './hooks/useGridState';
import { useNotifications } from '../pricing/hooks/useNotifications';

interface AnalysisProductsGridProps {
  analysisProducts: AnalysisProduct[];
  isLoading: boolean;
  refetchAnalysis: () => void;
}

const AnalysisProductsGrid: React.FC<AnalysisProductsGridProps> = ({ 
  analysisProducts, 
  isLoading,
  refetchAnalysis
}) => {
  const { 
    selectedProduct, 
    isDetailDrawerOpen, 
    expandedNoteId,
    setSelectedProduct,
    setIsDetailDrawerOpen,
    setExpandedNoteId
  } = useGridState();
  
  // Handle click on product row to show details
  const handleRowClick = (product: AnalysisProduct) => {
    setSelectedProduct(product);
    setIsDetailDrawerOpen(true);
  };

  // Toggle note expansion
  const toggleNoteExpansion = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setExpandedNoteId(expandedNoteId === productId ? null : productId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Produits en analyse ({analysisProducts.length})</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchAnalysis()} 
          disabled={isLoading}
          className="border-[#272727] bg-[#161616] hover:bg-[#222]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
      
      <AnalysisProductsTable
        analysisProducts={analysisProducts}
        isLoading={isLoading}
        expandedNoteId={expandedNoteId}
        handleRowClick={handleRowClick}
        toggleNoteExpansion={toggleNoteExpansion}
        refetchAnalysis={refetchAnalysis}
      />
      
      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        isOpen={isDetailDrawerOpen}
        onOpenChange={setIsDetailDrawerOpen}
        product={selectedProduct}
      />
    </div>
  );
};

export default AnalysisProductsGrid;
