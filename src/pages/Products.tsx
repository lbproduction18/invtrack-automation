
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { ProductsHeader } from '@/components/product/ProductsHeader';
import { ProductsFilters } from '@/components/product/ProductsFilters';
import { ProductTableContainer } from '@/components/product/ProductTableContainer';
import { Pagination } from '@/components/product/Pagination';
import { FilteredProductsList, type SortOption } from '@/components/product/FilteredProductsList';
import { type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type Product, type DatabasePriorityLevel } from '@/types/product';

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('oldest');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility[]>([
    { id: 'SKU', title: 'SKU', isVisible: true, order: 0 },
    { id: 'note', title: 'Note', isVisible: true, order: 1 },
    { id: 'date', title: 'Date Ajoutée', isVisible: true, order: 2 },
    { id: 'age', title: 'Âge', isVisible: true, order: 3 },
    { id: 'priority', title: 'Priorité', isVisible: true, order: 4 },
    { id: 'stock', title: 'Stock Actuel', isVisible: true, order: 5 },
    { id: 'threshold', title: 'Seuil', isVisible: true, order: 6 }
  ]);
  
  const { products, isLoading, refetch } = useProducts();
  const { toast } = useToast();
  
  const filteredProducts = FilteredProductsList({
    products,
    searchQuery,
    stockFilter,
    priorityFilter,
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

  const handleProductUpdate = async (productId: string, updatedData: Partial<Product>) => {
    try {
      const dataToSubmit: Record<string, any> = { ...updatedData };
      
      // Convert 'important' priority to 'prioritaire' when sending to the database
      if (updatedData.priority_badge) {
        dataToSubmit.priority_badge = updatedData.priority_badge === 'important' 
          ? 'prioritaire' as DatabasePriorityLevel
          : updatedData.priority_badge as DatabasePriorityLevel;
      }
      
      const { error } = await supabase
        .from('Low stock product')
        .update(dataToSubmit)
        .eq('id', productId);

      if (error) throw error;
      
      // Rafraîchir la liste des produits
      refetch();
      
      toast({
        title: "Produit mis à jour",
        description: "Les modifications ont été enregistrées avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ProductsHeader />

      <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-xl font-medium">Catalogue de Produits</CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <ProductsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onColumnOrderChange={handleColumnOrderChange}
          />
          
          <ProductTableContainer
            products={products}
            isLoading={isLoading}
            filteredProducts={filteredProducts}
            columnVisibility={columnVisibility}
            onProductUpdate={handleProductUpdate}
            onRefetch={refetch}
          />
          
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
