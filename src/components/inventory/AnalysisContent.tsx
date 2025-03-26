
import React, { useState } from 'react';
import ProductDetailsTable from './analysis/ProductDetailsTable';
import ProductSummary from './analysis/ProductSummary';
import ProductDetailsDrawer from './analysis/ProductDetailsDrawer';
import BudgetSimulation from './analysis/BudgetSimulation';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { type Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

// Define QuantityOption type consistently in this file
export type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000 | 8000;

// Define product shape explicitly
interface AnalysisProduct extends Product {
  selectedQuantity?: QuantityOption;
}

// Named export to match import in Index.tsx
export const AnalysisContent: React.FC = () => {
  const { products } = useProducts('analysis');
  const { analysisItems } = useAnalysisItems();
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Combine products with analysis items
  const analysisProducts = products
    .filter(product => {
      return analysisItems.some(item => item.product_id === product.id);
    })
    .map(product => {
      const analysisItem = analysisItems.find(item => item.product_id === product.id);
      return {
        ...product,
        selectedQuantity: analysisItem?.quantity_selected as QuantityOption | undefined
      };
    }) as AnalysisProduct[];

  // Calculate price for a product based on selected quantity
  const getTotalPrice = (product: AnalysisProduct): number => {
    if (!product.selectedQuantity) return 0;
    
    const priceField = `price_${product.selectedQuantity}` as keyof typeof product;
    return (product[priceField] as number || 0) * product.selectedQuantity;
  };

  // Show product details in drawer
  const handleShowDetails = (index: number) => {
    setActiveProductIndex(index);
    setIsDrawerOpen(true);
  };

  // Handle order creation
  const handleCreateOrder = () => {
    console.log('Create order with selected products');
    // Implement order creation logic
  };

  // AI optimization function
  const handleAIOptimize = () => {
    console.log('Optimize with AI');
    // Will be implemented later
  };

  return (
    <div className="space-y-6 p-4">
      {/* Budget Simulation */}
      <div className="mb-8">
        <BudgetSimulation 
          onCreateOrder={handleCreateOrder}
        />
      </div>
      
      {/* AI Optimization Button */}
      <div className="flex justify-end mb-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleAIOptimize}
        >
          <Sparkles className="h-4 w-4" />
          Optimiser avec l'IA
        </Button>
      </div>
      
      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductDetailsTable 
            products={analysisProducts}
            isLoading={false}
            onQuantityChange={() => {}} // No longer needed since we're using the new simulation
            getTotalPrice={getTotalPrice}
            onShowDetails={handleShowDetails}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ProductSummary 
            products={analysisProducts}
            isLoading={false}
            onShowDetails={handleShowDetails}
          />
        </div>
      </div>
      
      {/* Product Details Drawer */}
      {activeProductIndex !== null && analysisProducts[activeProductIndex] && (
        <ProductDetailsDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          selectedProduct={analysisProducts[activeProductIndex]}
          selectedProductIndex={activeProductIndex}
          productsCount={analysisProducts.length}
          onNavigate={(direction) => {
            if (direction === 'prev' && activeProductIndex > 0) {
              setActiveProductIndex(activeProductIndex - 1);
            } else if (direction === 'next' && activeProductIndex < analysisProducts.length - 1) {
              setActiveProductIndex(activeProductIndex + 1);
            }
          }}
          onQuantityChange={() => {}} // No longer needed
          onUpdateProduct={(productId, updates) => {
            console.log('Update product:', productId, updates);
            // Implement product update logic
          }}
          getTotalPrice={getTotalPrice}
          onCreateOrder={handleCreateOrder}
        />
      )}
    </div>
  );
};

// Also add default export to maintain compatibility
export default AnalysisContent;
