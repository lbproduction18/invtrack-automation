
import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useProductCategories } from '@/hooks/simulation/useProductCategories';
import { Product } from '@/types/product';
import { QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';

export interface SimulationSKUItem {
  productId: string;
  SKU: string;
  productName: string;
  quantity: QuantityOption;
  price: number;
}

export function useBudgetSimulation(createOrderCallback?: () => void) {
  const { products, isLoading: productsLoading } = useProducts();
  const { productPrices, isLoading: pricesLoading } = useProductPrices();
  const [simulationItems, setSimulationItems] = useState<any[]>([]);
  
  // Use the product categories hook
  const { categories } = useProductCategories(products || []);
  
  // Additional logic for simulation
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [budget, setBudget] = useState<number>(500000);
  const [currentTotal, setCurrentTotal] = useState<number>(0);
  
  // Budget simulation specific state
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, SelectedSKU[]>>({});
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, QuantityOption>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('order');
  const [budgetSettings, setBudgetSettings] = useState({
    total_budget: 500000,
    deposit_percentage: 50,
    notes: ''
  });
  
  // SKU related functions
  const handleAddSKU = (productCategory: string, product: { id: string; SKU: string; productName: string }) => {
    setSelectedSKUs(prev => {
      const categoryItems = prev[productCategory] || [];
      
      // Check if this SKU is already selected
      if (categoryItems.some(item => item.productId === product.id)) {
        return prev;
      }
      
      // Get price for this product
      const priceEntry = productPrices.find(p => p.id === product.id);
      const price = priceEntry ? Number(priceEntry.price_1000 || 0) : 0;
      
      const newSku: SelectedSKU = {
        productId: product.id,
        SKU: product.SKU,
        productName: product.productName,
        quantity: "1000",
        price: price
      };
      
      return {
        ...prev,
        [productCategory]: [...categoryItems, newSku]
      };
    });
  };
  
  const handleRemoveSKU = (productCategory: string, skuIndex: number) => {
    setSelectedSKUs(prev => {
      const categoryItems = [...(prev[productCategory] || [])];
      categoryItems.splice(skuIndex, 1);
      
      if (categoryItems.length === 0) {
        const newState = { ...prev };
        delete newState[productCategory];
        return newState;
      }
      
      return {
        ...prev,
        [productCategory]: categoryItems
      };
    });
  };
  
  const handleQuantityChange = (productCategory: string, skuIndex: number, newQuantity: QuantityOption) => {
    setSelectedSKUs(prev => {
      const categoryItems = [...(prev[productCategory] || [])];
      
      if (categoryItems[skuIndex]) {
        // Get the price for the new quantity
        const sku = categoryItems[skuIndex];
        const priceEntry = productPrices.find(p => p.id === sku.productId);
        const priceKey = `price_${newQuantity}`;
        const price = priceEntry ? Number(priceEntry[priceKey as keyof typeof priceEntry] || 0) : 0;
        
        categoryItems[skuIndex] = {
          ...categoryItems[skuIndex],
          quantity: newQuantity,
          price: price
        };
      }
      
      return {
        ...prev,
        [productCategory]: categoryItems
      };
    });
  };
  
  const handleOrderQuantityChange = (productId: string, quantity: QuantityOption) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  // Calculate current total whenever selected products change
  useEffect(() => {
    if (!selectedProducts.length || !productPrices) {
      setCurrentTotal(0);
      return;
    }
    
    const total = selectedProducts.reduce((sum, product) => {
      const price = productPrices.find(p => p.id === product.id)?.price_1000 || 0;
      return sum + Number(price);
    }, 0);
    
    setCurrentTotal(total);
  }, [selectedProducts, productPrices]);
  
  // Calculate simulation total whenever selected SKUs change
  useEffect(() => {
    let total = 0;
    
    Object.values(selectedSKUs).forEach(categoryItems => {
      categoryItems.forEach(sku => {
        total += sku.quantity ? Number(sku.quantity) * sku.price : 0;
      });
    });
    
    setSimulationTotal(total);
  }, [selectedSKUs]);
  
  // Group products by category for analysis
  const groupedAnalysisProducts = useMemo(() => {
    const groupedProducts: Record<string, Product[]> = {};
    
    products.forEach(product => {
      const category = product.product_name?.split(' ')[0] || 'Unknown';
      
      if (!groupedProducts[category]) {
        groupedProducts[category] = [];
      }
      
      groupedProducts[category].push(product);
    });
    
    return groupedProducts;
  }, [products]);
  
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
    
    const productPrice = productPrices.find(p => p.id === product.id)?.price_1000 || 0;
    return currentTotal + Number(productPrice) > budget;
  };
  
  // Get remaining budget
  const remainingBudget = useMemo(() => {
    return budget - simulationTotal;
  }, [budget, simulationTotal]);
  
  // Calculate deposit amount
  const depositAmount = useMemo(() => {
    return (simulationTotal * budgetSettings.deposit_percentage) / 100;
  }, [simulationTotal, budgetSettings.deposit_percentage]);
  
  // Calculate budget percentage
  const budgetPercentage = useMemo(() => {
    return budget > 0 ? (simulationTotal / budget) * 100 : 0;
  }, [simulationTotal, budget]);
  
  // Update budget
  const updateBudget = (newBudget: number) => {
    setBudget(newBudget);
  };
  
  // Helper function to calculate the total for a SKU
  const calculateSKUTotal = (sku: SelectedSKU): number => {
    return Number(sku.quantity) * sku.price;
  };
  
  // Helper function to get the unit price for a SKU
  const getUnitPriceForSKU = (productId: string, sku: string, quantity: string = "1000"): number => {
    const product = productPrices.find(p => p.id === productId);
    if (!product) return 0;
    
    const priceKey = `price_${quantity}`;
    return Number(product[priceKey as keyof typeof product] || 0);
  };
  
  // Refresh function for data
  const handleRefresh = async (): Promise<void> => {
    console.log("Refreshing budget simulation data...");
    return Promise.resolve();
  };
  
  // Define available quantity options
  const quantityOptions: QuantityOption[] = ["1000", "2000", "3000", "4000", "5000", "8000"];
  
  return {
    products,
    productPrices,
    simulationItems,
    categories,
    isLoading: productsLoading || pricesLoading,
    isPricesLoading: pricesLoading,
    isBudgetLoading: false,
    selectedProducts,
    addProduct,
    removeProduct,
    budget,
    updateBudget,
    currentTotal,
    remainingBudget,
    wouldExceedBudget,
    // Budget simulation specific returns
    budgetSettings,
    selectedQuantities,
    simulationTotal,
    activeTab,
    setActiveTab,
    totalBudget: budget,
    depositPercentage: budgetSettings.deposit_percentage,
    depositAmount,
    budgetPercentage,
    groupedAnalysisProducts,
    selectedSKUs,
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange,
    handleOrderQuantityChange,
    handleRefresh,
    calculateSKUTotal,
    getUnitPriceForSKU
  };
}
