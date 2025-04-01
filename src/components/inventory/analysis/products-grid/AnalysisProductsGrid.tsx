
import React, { useState } from 'react';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AnalysisProductsTable from './AnalysisProductsTable';
import { ProductDetailsDrawer } from '../product-details';

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
  const [isOpen, setIsOpen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<AnalysisProduct | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  
  const handleToggleExpand = () => {
    setIsOpen(!isOpen);
  };
  
  const handleProductClick = (product: AnalysisProduct) => {
    setSelectedProduct(product);
  };
  
  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const handleToggleNoteExpansion = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setExpandedNoteId(expandedNoteId === productId ? null : productId);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-xl font-bold">Produits en analyse</CardTitle>
        <CollapsibleTrigger asChild onClick={handleToggleExpand}>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </CardHeader>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="p-4">
            <AnalysisProductsTable 
              analysisProducts={analysisProducts}
              isLoading={isLoading}
              expandedNoteId={expandedNoteId}
              handleRowClick={handleProductClick}
              toggleNoteExpansion={handleToggleNoteExpansion}
              refetchAnalysis={refetchAnalysis}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
      
      {selectedProduct && (
        <ProductDetailsDrawer 
          product={selectedProduct} 
          open={!!selectedProduct} 
          onClose={handleCloseDetails}
          refetchAnalysis={refetchAnalysis}
        />
      )}
    </Card>
  );
};

export default AnalysisProductsGrid;
