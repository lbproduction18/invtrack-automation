
import React, { useState, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useAnalysisItems } from "@/hooks/useAnalysisItems";

// Import our new components
import BudgetSummary from './analysis/BudgetSummary';
import ProductSummary from './analysis/ProductSummary';
import ProductDetailsTable from './analysis/ProductDetailsTable';
import ProductDetailsDrawer from './analysis/ProductDetailsDrawer';

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
  
  // Handle creating a purchase order (placeholder - will be implemented in Step 3)
  const handleCreateOrder = () => {
    toast({
      title: "Création de la commande",
      description: "Cette fonctionnalité sera implémentée dans l'étape 3."
    });
  };

  // Get current selected product for the drawer
  const selectedProduct = selectedProductIndex !== null 
    ? selectedProducts[selectedProductIndex] 
    : null;

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
            <BudgetSummary
              productCount={selectedProducts.length}
              totalBudget={calculateTotalBudget()}
              configuredProductCount={selectedProducts.filter(p => p.selectedQuantity).length}
              onCreateOrder={handleCreateOrder}
            />
            
            {/* Product Summary */}
            <ProductSummary
              products={selectedProducts}
              isLoading={isLoading}
              onShowDetails={handleShowDetails}
            />
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
          <ProductDetailsTable 
            products={selectedProducts}
            isLoading={isLoading}
            onQuantityChange={handleQuantityChange}
            getTotalPrice={getTotalPrice}
            onShowDetails={handleShowDetails}
          />
        </TabsContent>
      </Tabs>
      
      {/* Product Details Drawer */}
      <ProductDetailsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        selectedProduct={selectedProduct}
        selectedProductIndex={selectedProductIndex}
        productsCount={selectedProducts.length}
        onNavigate={navigateProduct}
        onQuantityChange={handleQuantityChange}
        onUpdateProduct={handleUpdateProduct}
        getTotalPrice={getTotalPrice}
        onCreateOrder={handleCreateOrder}
      />
    </CardContent>
  );
};
