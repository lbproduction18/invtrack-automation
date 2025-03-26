
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ProductTable } from '@/components/product/ProductTable';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';

interface ProductTableContainerProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
  columnVisibility: ColumnVisibility[];
  onProductUpdate: (productId: string, updatedData: Partial<Product>) => void;
  onRefetch?: () => void;
}

export const ProductTableContainer: React.FC<ProductTableContainerProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility,
  onProductUpdate,
  onRefetch = () => {}
}) => {
  return (
    <div className="rounded-md border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b border-border/50">
            <TableHead className="w-[40px] p-1 text-center">
              {/* Header for checkboxes */}
            </TableHead>
            {columnVisibility
              .sort((a, b) => a.order - b.order)
              .map(column => (
                column.isVisible && (
                  <TableHead 
                    key={column.id} 
                    className={cn(
                      "text-xs font-medium p-0 text-center",
                      column.id === 'SKU' && "w-[30%] text-left pl-3",
                      column.id === 'note' && "w-[5%]",
                      column.id === 'date' && "w-[15%]",
                      column.id === 'age' && "w-[10%]",
                      column.id === 'priority' && "w-[10%]",
                      column.id === 'stock' && "w-[10%]",
                      column.id === 'threshold' && "w-[10%]"
                    )}
                  >
                    {column.title}
                  </TableHead>
                )
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <ProductTable 
            products={products}
            isLoading={isLoading}
            filteredProducts={filteredProducts}
            columnVisibility={columnVisibility}
            onProductUpdate={onProductUpdate}
          />
        </TableBody>
      </Table>
    </div>
  );
};
