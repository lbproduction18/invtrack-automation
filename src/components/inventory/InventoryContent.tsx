
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { FilteredProductsList, type SortOption } from '@/components/product/FilteredProductsList';
import { useProducts } from '@/hooks/useProducts';
import { type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';
import { Product, DatabasePriorityLevel } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InventoryFilterSection } from './InventoryFilterSection';
import { InventoryTable } from './InventoryTable';
import { InventoryPagination } from './InventoryPagination';

export const InventoryContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('oldest');
  const { products, isLoading, refetch } = useProducts('low_stock');
  const { toast } = useToast();
  
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility[]>([
    { id: 'SKU', title: 'SKU', isVisible: true, order: 0 },
    { id: 'note', title: 'Note', isVisible: true, order: 1 },
    { id: 'date', title: 'Date Ajoutée', isVisible: true, order: 2 },
    { id: 'age', title: 'Âge', isVisible: true, order: 3 },
    { id: 'priority', title: 'Priorité', isVisible: true, order: 4 },
    { id: 'stock', title: 'Stock Actuel', isVisible: true, order: 5 },
    { id: 'threshold', title: 'Seuil', isVisible: true, order: 6 }
  ]);

  const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
    if (columnId === 'SKU') return;
    
    setColumnVisibility(prev => 
      prev.map(col => col.id === columnId ? { ...col, isVisible } : col)
    );
  };
  
  const handleColumnOrderChange = (columnId: string, direction: 'up' | 'down') => {
    if (columnId === 'SKU') return;
    
    setColumnVisibility(prevColumns => {
      const newColumns = [...prevColumns];
      const currentIndex = newColumns.findIndex(col => col.id === columnId);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (targetIndex < 0 || targetIndex >= newColumns.length) {
        return prevColumns;
      }
      
      const currentOrder = newColumns[currentIndex].order;
      newColumns[currentIndex].order = newColumns[targetIndex].order;
      newColumns[targetIndex].order = currentOrder;
      
      return newColumns.sort((a, b) => a.order - b.order);
    });
  };

  const handleProductUpdate = async (productId: string, updatedData: Partial<Product>) => {
    try {
      const dataToSubmit: Record<string, any> = { ...updatedData };
      
      // Convert 'important' to 'prioritaire' before sending to database
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
  
  const filteredProducts = FilteredProductsList({ 
    products, 
    searchQuery, 
    stockFilter,
    priorityFilter,
    sortBy
  });

  return (
    <CardContent className="p-4">
      <InventoryFilterSection
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
      
      <InventoryTable
        products={products}
        isLoading={isLoading}
        filteredProducts={filteredProducts}
        columnVisibility={columnVisibility}
        onProductUpdate={handleProductUpdate}
        onRefetch={refetch}
      />
      
      <InventoryPagination
        isLoading={isLoading}
        filteredProductsCount={filteredProducts.length}
      />
    </CardContent>
  );
};
