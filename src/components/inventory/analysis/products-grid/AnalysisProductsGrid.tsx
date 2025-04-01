
import React, { useState } from 'react';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AnalysisProductsTable from './AnalysisProductsTable';
import { ProductDetailsDrawer } from '../product-details';
import { type Product } from '@/types/product';

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

  // Convert AnalysisProduct to Product format for ProductDetailsDrawer
  const mapToProductFormat = (analysisProduct: AnalysisProduct | null): Product | null => {
    if (!analysisProduct) return null;
    
    return {
      id: analysisProduct.product_id,
      SKU: analysisProduct.sku_code || '',
      product_name: analysisProduct.sku_label,
      current_stock: analysisProduct.stock || 0,
      threshold: analysisProduct.threshold || 0,
      created_at: analysisProduct.created_at,
      updated_at: analysisProduct.updated_at,
      priority_badge: analysisProduct.priority_badge as any || 'standard',
      note: analysisProduct.note || null,
      price_1000: analysisProduct.price_1000 || 0,
      price_2000: analysisProduct.price_2000 || 0,
      price_3000: analysisProduct.price_3000 || 0,
      price_4000: analysisProduct.price_4000 || 0,
      price_5000: analysisProduct.price_5000 || 0,
      price_8000: analysisProduct.price_8000 || 0,
      last_order_quantity: analysisProduct.quantity_selected || null,
      last_order_date: analysisProduct.last_order_date || null,
      lab_status: analysisProduct.lab_status_text || null,
      estimated_delivery_date: null,
      status: analysisProduct.status || null,
      weeks_delivery: analysisProduct.weeks_delivery || null,
    };
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-xl font-bold">Produits en analyse</CardTitle>
        <Button variant="ghost" size="sm" className="w-9 p-0" onClick={handleToggleExpand}>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
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
          isOpen={!!selectedProduct}
          onOpenChange={(isOpen) => !isOpen && handleCloseDetails()}
          selectedProduct={mapToProductFormat(selectedProduct)}
          selectedProductIndex={0}
          productsCount={1}
          onNavigate={() => {}}
          onQuantityChange={() => {}}
          onUpdateProduct={() => {}}
          getTotalPrice={() => 0}
          onCreateOrder={() => {}}
        />
      )}
    </Card>
  );
};

export default AnalysisProductsGrid;
