import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useProductCategories } from '@/hooks/simulation/useProductCategories';
import { Product } from '@/types/product';

export function useBudgetSimulation() {
  const { products, isLoading: productsLoading } = useProducts();
  const { productPrices, isLoading: pricesLoading } = useProductPrices();
  const [simulationItems, setSimulationItems] = useState<any[]>([]);
  
  // Use the product categories hook
  const { categories } = useProductCategories(products || []);
  
  // Additional logic for simulation
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [budget, setBudget] = useState<number>(500000);
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  
  // Calculate current total whenever selected products change
  useEffect(() => {
    if (!selectedProducts.length || !productPrices) {
      setCurrentTotal(0);
      return;
    }
    
    const total = selectedProducts.reduce((sum, product) => {
      const price = productPrices.find(p => p.product_id === product.id)?.price || 0;
      return sum + price;
    }, 0);
    
    setCurrentTotal(total);
  }, [selectedProducts, productPrices]);
  
  // Add product to simulation
  const addProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => [...prev, product]);
    }
  };
  
  // Remove product from simulation
  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  // Check if adding a product would exceed budget
  const wouldExceedBudget = (product: Product): boolean => {
    if (!productPrices) return false;
    
    const productPrice = productPrices.find(p => p.product_id === product.id)?.price || 0;
    return currentTotal + productPrice > budget;
  };
  
  // Get remaining budget
  const remainingBudget = useMemo(() => {
    return budget - currentTotal;
  }, [budget, currentTotal]);
  
  // Update budget
  const updateBudget = (newBudget: number) => {
    setBudget(newBudget);
  };
  
  return {
    products,
    productPrices,
    simulationItems,
    categories,
    isLoading: productsLoading || pricesLoading,
    selectedProducts,
    addProduct,
    removeProduct,
    budget,
    updateBudget,
    currentTotal,
    remainingBudget,
    wouldExceedBudget
  };
}
