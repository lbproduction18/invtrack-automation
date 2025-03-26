
import React, { useState } from 'react';
import { TableRow } from '@/components/ui/table';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { LoadingState, EmptyState } from './TableStates';
import { ProductTableRow } from './ProductTableRow';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
  columnVisibility: ColumnVisibility[];
  onProductUpdate?: (productId: string, updatedData: Partial<Product>) => void;
  selectedProducts?: string[];
  onSelectProduct?: (productId: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility,
  onProductUpdate = () => {},
  selectedProducts = [],
  onSelectProduct = () => {}
}) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handlePriorityChange = (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire') => {
    onProductUpdate(productId, { priority_badge: newPriority });
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      setShowDeleteDialog(true);
    } else {
      toast({
        title: "Aucun produit sélectionné",
        description: "Veuillez sélectionner au moins un produit à supprimer.",
        variant: "destructive"
      });
    }
  };

  const confirmDelete = () => {
    // Here you would add the actual delete functionality
    // For now, just show a success toast
    toast({
      title: `${selectedProducts.length} produit(s) supprimé(s)`,
      description: "Les produits sélectionnés ont été supprimés avec succès."
    });
    setShowDeleteDialog(false);
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
      {selectedProducts.length > 0 && (
        <TableRow className="bg-primary-foreground/10 border-y border-border">
          <td colSpan={visibleColumnsCount + 1} className="py-2 px-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {selectedProducts.length} produit(s) sélectionné(s)
              </span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSelected}
                className="h-8"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </td>
        </TableRow>
      )}
      
      {filteredProducts.map((product) => (
        <ProductTableRow
          key={product.id}
          product={product}
          columnVisibility={columnVisibility}
          onPriorityChange={handlePriorityChange}
          isSelected={selectedProducts.includes(product.id)}
          onSelect={() => onSelectProduct(product.id)}
        />
      ))}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer les {selectedProducts.length} produits sélectionnés ? 
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
