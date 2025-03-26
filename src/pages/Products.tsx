import React, { useState } from 'react';
import { 
  Package, 
  ArrowDown,
  Plus,
  ArrowDownAZ
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilterControls } from '@/components/product/ProductFilterControls';
import { ProductTable } from '@/components/product/ProductTable';
import { Pagination } from '@/components/product/Pagination';
import { FilteredProductsList, type SortOption } from '@/components/product/FilteredProductsList';
import { ColumnVisibilityDropdown, type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('oldest');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility[]>([
    { id: 'SKU', title: 'SKU', isVisible: true, order: 0 },
    { id: 'date', title: 'Date Ajoutée', isVisible: true, order: 1 },
    { id: 'stock', title: 'Stock Actuel', isVisible: true, order: 2 },
    { id: 'threshold', title: 'Seuil', isVisible: true, order: 3 },
    { id: 'age', title: 'Âge', isVisible: true, order: 4 }
  ]);
  
  const { products, isLoading } = useProducts();
  
  const filteredProducts = FilteredProductsList({
    products,
    searchQuery,
    stockFilter,
    sortBy
  });

  const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
    // Ensure SKU is always visible
    if (columnId === 'SKU') return;
    
    setColumnVisibility(prev => 
      prev.map(col => col.id === columnId ? { ...col, isVisible } : col)
    );
  };

  const handleColumnOrderChange = (columnId: string, direction: 'up' | 'down') => {
    // Prevent reordering the SKU column
    if (columnId === 'SKU') return;
    
    setColumnVisibility(prevColumns => {
      const newColumns = [...prevColumns];
      const currentIndex = newColumns.findIndex(col => col.id === columnId);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (targetIndex < 0 || targetIndex >= newColumns.length) {
        return prevColumns;
      }
      
      // Swap order values between the current column and target column
      const currentOrder = newColumns[currentIndex].order;
      newColumns[currentIndex].order = newColumns[targetIndex].order;
      newColumns[targetIndex].order = currentOrder;
      
      return newColumns.sort((a, b) => a.order - b.order);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="bg-background hover:bg-muted border-border"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button 
            className="bg-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        </div>
      </div>

      <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-xl font-medium">Catalogue de Produits</CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ProductFilterControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
            />
            
            <div className="flex items-center gap-2">
              <ColumnVisibilityDropdown 
                columns={columnVisibility}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                onColumnOrderChange={handleColumnOrderChange}
              />
              
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oldest">Plus ancien d'abord</SelectItem>
                  <SelectItem value="newest">Plus récent d'abord</SelectItem>
                  <SelectItem value="low-stock">Stock bas d'abord</SelectItem>
                  <SelectItem value="high-stock">Stock élevé d'abord</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  {columnVisibility
                    .sort((a, b) => a.order - b.order) // Trier par ordre avant d'afficher
                    .map(column => (
                      column.isVisible && (
                        <TableHead 
                          key={column.id} 
                          className={cn(
                            "text-xs font-medium",
                            (column.id === 'stock' || column.id === 'threshold' || column.id === 'age') && "text-right w-24"
                          )}
                        >
                          {column.title}
                        </TableHead>
                      )
                    ))}
                  <TableHead className="text-xs font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ProductTable 
                  products={products}
                  isLoading={isLoading}
                  filteredProducts={filteredProducts}
                  columnVisibility={columnVisibility}
                />
              </TableBody>
            </Table>
          </div>
          
          <Pagination 
            filteredCount={filteredProducts.length}
            totalCount={products.length}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
