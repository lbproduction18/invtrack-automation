
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
}

export const ProductTableContainer: React.FC<ProductTableContainerProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility,
  onProductUpdate
}) => {
  return (
    <div className="rounded-md border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b border-border/50">
            {columnVisibility
              .sort((a, b) => a.order - b.order)
              .map(column => (
                column.isVisible && (
                  <TableHead 
                    key={column.id} 
                    className={cn(
                      "text-xs font-medium p-0",
                      column.id === 'SKU' && "w-[35%]",
                      column.id === 'date' && "w-[10%]",
                      column.id === 'stock' && "text-right w-[10%]",
                      column.id === 'threshold' && "text-right w-[10%]",
                      column.id === 'age' && "text-right w-[5%]",
                      column.id === 'priority' && "w-[25%]"
                    )}
                  >
                    {column.title}
                  </TableHead>
                )
              ))}
            <TableHead className="text-xs font-medium text-right w-[5%] p-0">Actions</TableHead>
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
