
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
import { useBudgetSettings } from "@/hooks/useBudgetSettings";

// Import our components
import BudgetSummary from './analysis/BudgetSummary';
import ProductSummary from './analysis/ProductSummary';
import ProductDetailsTable from './analysis/ProductDetailsTable';
import ProductDetailsDrawer from './analysis/ProductDetailsDrawer';
import OrderSimulationTable from './analysis/OrderSimulationTable';
import BudgetSettingsPanel from './analysis/BudgetSettingsPanel';

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
  const { budgetSettings } = useBudgetSettings();
  const { toast } = useToast();
  
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Store grouped product quantities
  const [groupedQuantities, setGroupedQuantities] = useState<Record<string, number>>({});
  
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
      
      // Initialize grouped quantities
      const groupedProducts = initialSelectedProducts.reduce((acc, product) => {
        // Extract base product name (assuming format is "ProductName - Flavor")
        const baseName = product.product_name?.split('-')[0]?.trim() || product.product_name || '';
        
        if (!acc[baseName]) {
          acc[baseName] = 0;
        }
        
        // If this product has a selected quantity, use it
        if (product.selectedQuantity) {
          acc[baseName] = product.selectedQuantity;
        }
        
        return acc;
      }, {} as Record<string, number>);
      
      setGroupedQuantities(groupedProducts);
    }
  }, [analysisProducts, analysisItems]);
  
  // Get total price based on quantity for a single product
  const getTotalPrice = (product: SelectedProduct) => {
    if (!product.selectedQuantity) return 0;
    
    const priceKey = `price_${product.selectedQuantity}` as keyof Product;
    return product[priceKey] as number || 0;
  };
  
  // Calculate total budget for individual products
  const calculateTotalBudget = () => {
    return selectedProducts.reduce((total, product) => {
      return total + getTotalPrice(product);
    }, 0);
  };
  
  // Calculate total budget for grouped simulation
  const calculateSimulationTotal = () => {
    // Group products by name
    const groupedProducts = selectedProducts.reduce((acc, product) => {
      const baseName = product.product_name?.split('-')[0]?.trim() || product.product_name || '';
      
      if (!acc[baseName]) {
        acc[baseName] = [];
      }
      
      acc[baseName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
    
    // Calculate total for all groups
    return Object.entries(groupedProducts).reduce((total, [groupName, products]) => {
      const selectedQty = groupedQuantities[groupName] || 0;
      
      if (selectedQty === 0) return total;
      
      const priceKey = `price_${selectedQty}` as keyof Product;
      const validProducts = products.filter(p => p[priceKey] !== null && p[priceKey] !== undefined);
      
      if (validProducts.length === 0) return total;
      
      const avgPrice = validProducts.reduce((sum, p) => sum + (p[priceKey] as number || 0), 0) / validProducts.length;
      return total + (avgPrice * selectedQty);
    }, 0);
  };
  
  // Handle quantity selection for individual products
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
  
  // Handle quantity selection for grouped products simulation
  const handleGroupQuantityChange = (groupName: string, quantity: number) => {
    setGroupedQuantities(prev => ({
      ...prev,
      [groupName]: quantity
    }));
    
    // Also update individual product quantities if they match this group
    selectedProducts.forEach(product => {
      const baseName = product.product_name?.split('-')[0]?.trim() || product.product_name || '';
      
      if (baseName === groupName && quantity > 0) {
        handleQuantityChange(product.id, quantity as QuantityOption);
      }
    });
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
    
  // Calculate total for the budget panel
  const totalOrderAmount = calculateSimulationTotal();

  return (
    <CardContent className="p-4">
      <div className="space-y-6">
        {/* Simulation Table Panel */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Simulation de Commande</h3>
          <OrderSimulationTable 
            products={selectedProducts}
            selectedQuantities={groupedQuantities}
            onQuantityChange={handleGroupQuantityChange}
          />
        </div>
        
        {/* Two Column Layout for Budget and Detailed Views */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Budget Settings */}
          <div className="lg:col-span-1">
            <BudgetSettingsPanel
              totalOrderAmount={totalOrderAmount}
              onCreateOrder={handleCreateOrder}
            />
          </div>
          
          {/* Right Column - Product Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="detailed">Détaillé</TabsTrigger>
              </TabsList>
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Summary */}
                  <ProductSummary
                    products={selectedProducts}
                    isLoading={isLoading}
                    onShowDetails={handleShowDetails}
                  />
                  
                  {/* Budget Summary - Using our original component */}
                  <BudgetSummary
                    productCount={selectedProducts.length}
                    totalBudget={calculateTotalBudget()}
                    configuredProductCount={selectedProducts.filter(p => p.selectedQuantity).length}
                    onCreateOrder={handleCreateOrder}
                  />
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
          </div>
        </div>
      </div>
      
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
