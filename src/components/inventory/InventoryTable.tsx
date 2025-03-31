
import React, { useState } from 'react';
import { Product } from '@/types/product';
import { type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { SelectedProductsBar } from './SelectedProductsBar';
import { DeleteProductsDialog } from './DeleteProductsDialog';
import { ProductsTable } from './ProductsTable';

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
  columnVisibility: ColumnVisibility[];
  onProductUpdate: (productId: string, updatedData: Partial<Product>) => void;
  onRefetch: () => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility,
  onProductUpdate,
  onRefetch
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { addToAnalysis } = useAnalysisItems();

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from('Low stock product')
        .delete()
        .in('id', selectedProducts);

      if (error) throw error;
      
      toast({
        title: "Produits supprimés",
        description: `${selectedProducts.length} produit(s) ont été supprimés avec succès.`
      });
      
      setSelectedProducts([]);
      setIsDeleteDialogOpen(false);
      onRefetch();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les produits. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleSendToAnalysis = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Aucun produit sélectionné",
        description: "Veuillez sélectionner au moins un produit à envoyer à l'analyse.",
        variant: "destructive"
      });
      return;
    }

    addToAnalysis.mutate(selectedProducts, {
      onSuccess: () => {
        setSelectedProducts([]);
      }
    });
  };

  const handleSendSingleToAnalysis = (productId: string) => {
    addToAnalysis.mutate([productId], {
      onSuccess: () => {
        toast({
          title: "Produit ajouté à l'analyse",
          description: "Le produit a été transféré avec succès."
        });
      }
    });
  };

  return (
    <div className="space-y-2">
      <SelectedProductsBar 
        selectedCount={selectedProducts.length}
        onSendToAnalysis={handleSendToAnalysis}
        onDelete={() => setIsDeleteDialogOpen(true)}
        isAnalysisPending={addToAnalysis.isPending}
      />
      
      <ProductsTable
        products={products}
        isLoading={isLoading}
        filteredProducts={filteredProducts}
        columnVisibility={columnVisibility}
        selectedProducts={selectedProducts}
        onSelectAll={handleSelectAll}
        onSelectProduct={handleSelectProduct}
        onProductUpdate={onProductUpdate}
        onSendToAnalysis={handleSendSingleToAnalysis}
      />
      
      <DeleteProductsDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteSelected}
        selectedCount={selectedProducts.length}
      />
    </div>
  );
};
