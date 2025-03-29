import React, { useState } from 'react';
import { AlertTriangle, Trash2, ChevronRight } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ProductTable } from '@/components/product/ProductTable';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

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

  return (
    <div className="space-y-2">
      {selectedProducts.length > 0 && (
        <div className="flex items-center justify-between bg-muted/30 border border-border/50 p-2 rounded-md mb-2">
          <span className="text-sm font-medium px-2">
            {selectedProducts.length} produit(s) sélectionné(s)
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSendToAnalysis}
              className="gap-1"
              disabled={addToAnalysis.isPending}
            >
              <ChevronRight className="h-4 w-4" /> 
              Envoyer à l'analyse
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" /> 
              Supprimer
            </Button>
          </div>
        </div>
      )}
      
      <div className="rounded-md border border-[#272727] overflow-hidden mt-4">
        <Table>
          <TableHeader className="bg-[#161616]">
            <TableRow className="hover:bg-transparent border-b border-[#272727]">
              <TableHead className="w-[40px] p-1 text-center">
                <Checkbox 
                  checked={selectedProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                  onCheckedChange={handleSelectAll}
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
                onSelectProduct={handleSelectProduct}
                showAnalysisButton={true}
              />
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ces produits?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement 
              {selectedProducts.length > 1 
                ? ` les ${selectedProducts.length} produits sélectionnés` 
                : ' le produit sélectionné'
              } de votre inventaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
