
import React, { useState } from 'react';
import ProductDetailsTable from './analysis/ProductDetailsTable';
import ProductSummary from './analysis/ProductSummary';
import ProductDetailsDrawer from './analysis/ProductDetailsDrawer';
import BudgetSimulation from './analysis/BudgetSimulation';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

// Define QuantityOption type consistently in this file
export type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000 | 8000;

// Define product shape explicitly
interface AnalysisProduct extends Product {
  selectedQuantity?: QuantityOption;
}

interface Product {
  id: string;
  SKU: string;
  product_name: string;
  current_stock: number;
  threshold: number;
  created_at: string;
  updated_at: string;
  priority_badge: "standard" | "important" | "prioritaire";
  note: string | null;
  price_1000: number | null;
  price_2000: number | null;
  price_3000: number | null;
  price_4000: number | null;
  price_5000: number | null;
  price_8000: number | null;
  last_order_quantity: number | null;
  last_order_date: string | null;
  lab_status: string | null;
  estimated_delivery_date: string | null;
  status: string;
}

// Named export to match import in Index.tsx
export const AnalysisContent: React.FC = () => {
  const { products } = useProducts('analysis');
  const { analysisItems } = useAnalysisItems();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, QuantityOption>>({});
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

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

  // Handle quantity selection for a product
  const handleQuantityChange = (productId: string, quantity: QuantityOption) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
    
    // Update total order amount based on selected quantities
    calculateTotalOrderAmount();
  };

  // Calculate price for a product based on selected quantity
  const getTotalPrice = (product: AnalysisProduct): number => {
    if (!product.selectedQuantity) return 0;
    
    const priceField = `price_${product.selectedQuantity}` as keyof typeof product;
    return (product[priceField] as number || 0) * product.selectedQuantity;
  };

  // Calculate total order amount
  const calculateTotalOrderAmount = () => {
    const total = analysisProducts.reduce((sum, product) => {
      return sum + getTotalPrice(product);
    }, 0);
    
    setTotalOrderAmount(total);
  };

  // Show product details in drawer
  const handleShowDetails = (index: number) => {
    setActiveProductIndex(index);
    setIsDrawerOpen(true);
  };

  // Handle order creation
  const handleCreateOrder = () => {
    console.log('Create order with total amount:', totalOrderAmount);
    // Implement order creation logic
  };

  return (
    <div className="space-y-6 p-4">
      {/* Budget Simulation Component */}
      <BudgetSimulation onCreateOrder={handleCreateOrder} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductDetailsTable 
            products={analysisProducts}
            isLoading={false}
            onQuantityChange={handleQuantityChange}
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
          onClose={() => setIsDrawerOpen(false)}
          onQuantityChange={(quantity: any) => {
            if (activeProductIndex !== null && analysisProducts[activeProductIndex]) {
              handleQuantityChange(
                analysisProducts[activeProductIndex].id, 
                quantity as QuantityOption
              );
            }
          }}
          product={analysisProducts[activeProductIndex]}
        />
      )}
    </div>
  );
};

// Also add default export to maintain compatibility
export default AnalysisContent;
