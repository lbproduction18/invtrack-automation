
import React, { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  X, 
  HelpCircle, 
  Clock, 
  AlertCircle, 
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { formatDate } from "@/components/dashboard/low-stock/utils";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { useAnalysisItems } from "@/hooks/useAnalysisItems";

// Types
type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000;
type SelectedProduct = Product & { 
  selectedQuantity?: QuantityOption;
  labStatus?: string | null;
};

export const AnalysisContent: React.FC = () => {
  // Fetch products with status 'analysis'
  const { products: analysisProducts, isLoading, refetch } = useProducts('analysis');
  const { analysisItems } = useAnalysisItems();
  const { toast } = useToast();
  
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000];
  
  // When products load, initialize selected products with analysis ones
  useEffect(() => {
    if (analysisProducts.length > 0) {
      const initialSelectedProducts: SelectedProduct[] = analysisProducts.map(product => {
        // Find if this product has an analysis item
        const analysisItem = analysisItems.find(item => item.product_id === product.id);
        
        return {
          ...product,
          selectedQuantity: analysisItem?.quantity_selected as QuantityOption || undefined
        };
      });
      
      setSelectedProducts(initialSelectedProducts);
    }
  }, [analysisProducts, analysisItems]);
  
  // Get total price based on quantity
  const getTotalPrice = (product: SelectedProduct) => {
    if (!product.selectedQuantity) return 0;
    
    const priceKey = `price_${product.selectedQuantity}` as keyof Product;
    return product[priceKey] as number || 0;
  };
  
  // Calculate total budget
  const calculateTotalBudget = () => {
    return selectedProducts.reduce((total, product) => {
      return total + getTotalPrice(product);
    }, 0);
  };
  
  // Handle quantity selection
  const handleQuantityChange = async (productId: string, quantity: QuantityOption) => {
    // Update the state
    setSelectedProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, selectedQuantity: quantity } 
          : p
      )
    );
    
    // Save to database
    try {
      const { error } = await supabase
        .from('analysis_items')
        .update({ quantity_selected: quantity })
        .eq('product_id', productId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité.",
        variant: "destructive"
      });
    }
  };
  
  // Show product details
  const handleShowDetails = (index: number) => {
    setSelectedProductIndex(index);
    setIsDrawerOpen(true);
  };
  
  // Navigate between products in the drawer
  const navigateProduct = (direction: 'prev' | 'next') => {
    if (selectedProductIndex === null) return;
    
    const newIndex = direction === 'next' 
      ? Math.min(selectedProductIndex + 1, selectedProducts.length - 1)
      : Math.max(selectedProductIndex - 1, 0);
      
    setSelectedProductIndex(newIndex);
  };
  
  // Get current selected product for the drawer
  const selectedProduct = selectedProductIndex !== null 
    ? selectedProducts[selectedProductIndex] 
    : null;
  
  // Update product attributes
  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('Low stock product')
        .update(updates)
        .eq('id', productId);
        
      if (error) throw error;
      
      // Update local state
      setSelectedProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, ...updates } : p)
      );
      
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(prev => prev ? { ...prev, ...updates } : prev);
      }
      
      toast({
        title: "Produit mis à jour",
        description: "Les modifications ont été enregistrées avec succès."
      });
      
      // Refresh data
      refetch();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit.",
        variant: "destructive"
      });
    }
  };
  
  // Handle updating the selected product in the drawer
  const setSelectedProduct = (
    updater: ((prev: SelectedProduct | null) => SelectedProduct | null) | SelectedProduct | null
  ) => {
    if (selectedProductIndex === null) return;
    
    const newSelectedProduct = typeof updater === 'function'
      ? updater(selectedProduct)
      : updater;
      
    if (newSelectedProduct) {
      setSelectedProducts(prev => 
        prev.map((p, idx) => idx === selectedProductIndex ? newSelectedProduct : p)
      );
    }
  };
  
  // Handle creating a purchase order (placeholder - will be implemented in Step 3)
  const handleCreateOrder = () => {
    toast({
      title: "Création de la commande",
      description: "Cette fonctionnalité sera implémentée dans l'étape 3."
    });
  };

  return (
    <CardContent className="p-4">
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="detailed">Détaillé</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget Summary */}
            <div className="bg-[#161616] rounded-md p-4 border border-[#272727]">
              <h3 className="text-sm font-medium mb-2">Résumé du Budget</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Produits:</span>
                  <span>{selectedProducts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Budget:</span>
                  <span className="font-semibold">{calculateTotalBudget().toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Produits configurés:</span>
                  <span>
                    {selectedProducts.filter(p => p.selectedQuantity).length} / {selectedProducts.length}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  className="w-full"
                  onClick={handleCreateOrder}
                  disabled={selectedProducts.filter(p => p.selectedQuantity).length === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Créer le Bon de Commande
                </Button>
              </div>
            </div>
            
            {/* Product Summary */}
            <div className="bg-[#161616] rounded-md p-4 border border-[#272727]">
              <h3 className="text-sm font-medium mb-2">Liste des Produits</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="flex justify-between items-center text-sm p-2 hover:bg-[#272727]/30 rounded-sm cursor-pointer"
                    onClick={() => handleShowDetails(index)}
                  >
                    <div className="flex items-center space-x-2">
                      {product.selectedQuantity ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                      <span>{product.SKU}</span>
                    </div>
                    <Badge 
                      variant={product.selectedQuantity ? "outline" : "secondary"}
                      className={cn(
                        "text-xs",
                        product.selectedQuantity ? "border-green-500 text-green-500" : "text-amber-500"
                      )}
                    >
                      {product.selectedQuantity 
                        ? `${product.selectedQuantity.toLocaleString()} pcs` 
                        : "En attente"}
                    </Badge>
                  </div>
                ))}
                
                {selectedProducts.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <HelpCircle className="h-8 w-8 mb-2" />
                    <p className="text-sm">Aucun produit en analyse</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2" />
                    <p className="text-sm">Chargement...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Proceed Button */}
          <div className="flex justify-end mt-4">
            <Button className="gap-1" size="sm" onClick={handleCreateOrder}>
              Passer à la Commande
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        {/* Detailed Tab */}
        <TabsContent value="detailed">
          <div className="rounded-md border border-[#272727] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#161616]">
                <TableRow className="hover:bg-transparent border-b border-[#272727]">
                  <TableHead className="text-xs font-medium text-gray-400 w-[30%] text-left pl-3">SKU</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-center">Stock Actuel</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-center">Seuil</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-center">Dernière Commande</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-center">Quantité</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-center">Prix</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell colSpan={7} className="h-16">
                        <div className="w-full h-full animate-pulse bg-[#161616]/50" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : selectedProducts.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-400">Aucun produit en analyse</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Products table
                  selectedProducts.map((product, index) => (
                    <TableRow key={product.id} className="hover:bg-[#161616]">
                      <TableCell className="font-medium whitespace-nowrap pl-3">
                        <div className="flex flex-col">
                          <span>{product.SKU}</span>
                          {product.product_name && (
                            <span className="text-xs text-gray-400">{product.product_name}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={product.current_stock < product.threshold ? "text-red-500" : ""}>
                          {product.current_stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-gray-400">
                        {product.threshold}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {product.last_order_date ? (
                          <div className="flex flex-col items-center">
                            <span>{formatDate(product.last_order_date)}</span>
                            <span className="text-gray-400">{product.last_order_quantity} pcs</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      
                      {/* Quantity selector */}
                      <TableCell>
                        <Select
                          value={product.selectedQuantity?.toString() || undefined}
                          onValueChange={(value) => {
                            if (value) {
                              const qty = parseInt(value) as QuantityOption;
                              handleQuantityChange(product.id, qty);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                            <SelectValue placeholder="Choisir" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#161616] border-[#272727]">
                            {quantityOptions.map(qty => (
                              <SelectItem key={qty} value={qty.toString()}>
                                {qty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {product.selectedQuantity ? (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {getTotalPrice(product).toLocaleString()} €
                            </span>
                            <span className="text-xs text-gray-400">
                              {(getTotalPrice(product) / product.selectedQuantity * 1000).toFixed(2)} € / 1000
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex justify-center space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleShowDetails(index)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Product Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md bg-[#141414] border-l border-[#272727]">
          {selectedProduct && (
            <>
              <SheetHeader className="border-b border-[#272727] pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <SheetTitle className="text-left">{selectedProduct.SKU}</SheetTitle>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => navigateProduct('prev')}
                      disabled={selectedProductIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => navigateProduct('next')}
                      disabled={selectedProductIndex === selectedProducts.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <SheetDescription>
                  {selectedProduct.product_name || "Produit sans nom"}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                {/* Stock Information */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Informations de Stock</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-400">Stock Actuel:</div>
                    <div className={selectedProduct.current_stock < selectedProduct.threshold ? "text-red-500" : ""}>
                      {selectedProduct.current_stock}
                    </div>
                    <div className="text-gray-400">Seuil:</div>
                    <div>{selectedProduct.threshold}</div>
                    <div className="text-gray-400">Priorité:</div>
                    <div>{selectedProduct.priority_badge}</div>
                    <div className="text-gray-400">Date d'ajout:</div>
                    <div>{formatDate(selectedProduct.created_at)}</div>
                  </div>
                </div>
                
                {/* Last Order */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Dernière Commande</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-400">Date:</div>
                    <div>{selectedProduct.last_order_date ? formatDate(selectedProduct.last_order_date) : "-"}</div>
                    <div className="text-gray-400">Quantité:</div>
                    <div>{selectedProduct.last_order_quantity || "-"}</div>
                  </div>
                </div>
                
                {/* Order Configuration */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Configuration de la Commande</h3>
                  
                  <div className="bg-[#1A1A1A] p-3 rounded-md mb-3">
                    <div className="text-sm mb-2">Quantité à commander:</div>
                    <Select
                      value={selectedProduct.selectedQuantity?.toString() || undefined}
                      onValueChange={(value) => {
                        if (value) {
                          const qty = parseInt(value) as QuantityOption;
                          handleQuantityChange(selectedProduct.id, qty);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                        <SelectValue placeholder="Choisir une quantité" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#161616] border-[#272727]">
                        {quantityOptions.map(qty => (
                          <SelectItem key={qty} value={qty.toString()}>
                            {qty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedProduct.selectedQuantity && (
                      <div className="mt-2 text-right">
                        <div className="text-xs text-gray-400">Prix total:</div>
                        <div className="font-medium">{getTotalPrice(selectedProduct).toLocaleString()} €</div>
                        <div className="text-xs text-gray-400">
                          {(getTotalPrice(selectedProduct) / selectedProduct.selectedQuantity * 1000).toFixed(2)} € / 1000
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Étiquette au laboratoire</p>
                      <Select
                        value={selectedProduct.lab_status || undefined}
                        onValueChange={(value) => {
                          handleUpdateProduct(selectedProduct.id, { lab_status: value });
                        }}
                      >
                        <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                          <SelectValue placeholder="Choisir un statut" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161616] border-[#272727]">
                          <SelectItem value="OK">OK</SelectItem>
                          <SelectItem value="À commander">À commander</SelectItem>
                          <SelectItem value="Manquante">Manquante</SelectItem>
                          <SelectItem value="En attente">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Date de livraison estimée</p>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 bg-[#121212] border border-[#272727] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          value={selectedProduct.estimated_delivery_date || ""}
                          onChange={(e) => {
                            handleUpdateProduct(selectedProduct.id, { 
                              estimated_delivery_date: e.target.value || null 
                            });
                          }}
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Product Notes */}
                {selectedProduct.note && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Notes</h3>
                    <div className="bg-[#1A1A1A] p-3 rounded-md text-sm">
                      {selectedProduct.note}
                    </div>
                  </div>
                )}
              </div>
              
              <SheetFooter className="flex mt-6 border-t border-[#272727] pt-4">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Fermer
                  </Button>
                </SheetClose>
                <Button className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Commander
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </CardContent>
  );
};
