
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductTable } from '@/components/product/ProductTable';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
  columnVisibility: ColumnVisibility[];
  selectedProducts: string[];
  onSelectAll: () => void;
  onSelectProduct: (productId: string) => void;
  onProductUpdate: (productId: string, updatedData: Partial<Product>) => void;
  onSendToAnalysis: (productId: string) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onProductUpdate,
  onSendToAnalysis
}) => {
  return (
    <div className="rounded-md border border-[#272727] overflow-hidden mt-4">
      <Table>
        <TableHeader className="bg-[#161616]">
          <TableRow className="hover:bg-transparent border-b border-[#272727]">
            <TableHead className="w-[40px] p-1 text-center">
              <Checkbox 
                checked={selectedProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                onCheckedChange={onSelectAll}
                aria-label="Select all products"
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
            </TableHead>
            {columnVisibility
              .sort((a, b) => a.order - b.order)
              .map(column => (
                column.isVisible && (
                  <TableHead 
                    key={column.id} 
                    className={cn(
                      "text-xs font-medium text-gray-400 p-1 text-center",
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
            <TableHead className="w-[100px] text-xs font-medium text-gray-400 p-1 text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`} className="border-b border-[#272727] hover:bg-[#161616]">
                <TableCell className="w-[40px] p-1 text-center">
                  <div className="w-4 h-4 rounded animate-pulse bg-[#161616]/50" />
                </TableCell>
                <TableCell colSpan={columnVisibility.filter(col => col.isVisible).length + 1} className="h-12 animate-pulse bg-[#161616]/50"></TableCell>
              </TableRow>
            ))
          ) : filteredProducts.length === 0 ? (
            <TableRow className="hover:bg-[#161616]">
              <TableCell colSpan={columnVisibility.filter(col => col.isVisible).length + 2} className="h-24 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
                  <p>Aucun produit trouvé</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <ProductTable 
              products={products} 
              isLoading={isLoading} 
              filteredProducts={filteredProducts}
              columnVisibility={columnVisibility}
              onProductUpdate={onProductUpdate}
              selectedProducts={selectedProducts}
              onSelectProduct={onSelectProduct}
              showAnalysisButton={true}
              onSendToAnalysis={onSendToAnalysis}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
};
