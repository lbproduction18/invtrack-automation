
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { LoadingState, EmptyState } from './TableStates';
import { ProductTableRow } from './ProductTableRow';
import { useToast } from '@/hooks/use-toast';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
  columnVisibility: ColumnVisibility[];
  onProductUpdate?: (productId: string, updatedData: Partial<Product>) => void;
  selectedProducts?: string[];
  onSelectProduct?: (productId: string) => void;
  showAnalysisButton?: boolean;
  onSendToAnalysis?: (productId: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility,
  onProductUpdate = () => {},
  selectedProducts = [],
  onSelectProduct = () => {},
  showAnalysisButton = false,
  onSendToAnalysis
}) => {
  const { toast } = useToast();
  const { addToAnalysis } = useAnalysisItems();
  
  const handlePriorityChange = (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire') => {
    onProductUpdate(productId, { priority_badge: newPriority });
  };

  const handleSendToAnalysis = (productId: string) => {
    if (onSendToAnalysis) {
      onSendToAnalysis(productId);
    } else {
      addToAnalysis.mutate([productId], {
        onSuccess: () => {
          toast({
            title: "Produit ajouté à l'analyse",
            description: "Le produit a été transféré avec succès."
          });
        }
      });
    }
  };

  // Calculate visible columns count for proper colSpan in loading and empty states
  const visibleColumnsCount = columnVisibility.filter(col => col.isVisible).length;

  if (isLoading) {
    return <LoadingState colSpan={visibleColumnsCount} />;
  }

  if (filteredProducts.length === 0) {
    return <EmptyState colSpan={visibleColumnsCount} />;
  }

  return (
    <>
      {filteredProducts.map((product) => (
        <ProductTableRow
          key={product.id}
          product={product}
          columnVisibility={columnVisibility}
          onPriorityChange={handlePriorityChange}
          isSelected={selectedProducts.includes(product.id)}
          onSelect={() => onSelectProduct(product.id)}
          showAnalysisButton={showAnalysisButton}
          onSendToAnalysis={handleSendToAnalysis}
        />
      ))}
    </>
  );
};
