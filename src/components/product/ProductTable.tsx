
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { LoadingState, EmptyState } from './TableStates';
import { ProductTableRow } from './ProductTableRow';
import { useToast } from '@/hooks/use-toast';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
  columnVisibility: ColumnVisibility[];
  onProductUpdate?: (productId: string, updatedData: Partial<Product>) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility,
  onProductUpdate = () => {}
}) => {
  const { toast } = useToast();
  
  const handlePriorityChange = (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire') => {
    onProductUpdate(productId, { priority_badge: newPriority });
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
          onProductUpdate={onProductUpdate}
          onPriorityChange={handlePriorityChange}
        />
      ))}
    </>
  );
};
