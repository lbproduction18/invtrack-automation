
import { useState, useEffect } from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useSimulationState } from '@/hooks/useSimulationState';
import { useSimulationSKUs } from '@/hooks/useSimulationSKUs';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

export function useBudgetSimulation(onCreateOrder: () => void) {
  const { products } = useProducts('analysis');
  const { analysisItems } = useAnalysisItems();
  const { productPrices, isLoading: isPricesLoading, refetch } = useProductPrices();
  const { budgetSettings, isLoading: isBudgetLoading } = useBudgetSettings();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, QuantityOption>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('order');
  
  const totalBudget = budgetSettings?.total_budget || 0;
  const depositPercentage = budgetSettings?.deposit_percentage || 50;
  
  // Calculate metrics based on simulationTotal
  const depositAmount = (simulationTotal * depositPercentage) / 100;
  const remainingBudget = totalBudget - depositAmount;
  const budgetPercentage = totalBudget > 0 ? (depositAmount / totalBudget) * 100 : 0;
  
  // Prepare products for simulation
  const groupedAnalysisProducts = products.reduce((acc, product) => {
    // Extract category from SKU (e.g., "COLLAGENE-LOTUS" => "COLLAGENE")
    const skuParts = product.SKU.split('-');
    const category = skuParts[0];
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push({
      id: product.id,
      SKU: product.SKU,
      productName: product.product_name
    });
    
    return acc;
  }, {} as Record<string, Array<{ id: string, SKU: string, productName: string | null }>>);
  
  // Hook for simulation state
  const {
    selectedSKUs,
    setSelectedSKUs,
    calculateSKUTotal
  } = useSimulationState();
  
  // Hook for SKU operations
  const {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange
  } = useSimulationSKUs(selectedSKUs, setSelectedSKUs, productPrices);
  
  // Handle quantity changes in the OrderSimulationTable
  const handleOrderQuantityChange = (productId: string, quantity: QuantityOption) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  // Update SelectedSKUs whenever analysisItems changes
  useEffect(() => {
    if (analysisItems.length > 0 && products.length > 0 && productPrices.length > 0) {
      // Logic to pre-populate selectedSKUs based on analysisItems
    }
  }, [analysisItems, products, productPrices]);

  // Handle refresh button click
  const handleRefresh = async () => {
    await refetch();
  };

  return {
    products,
    analysisItems,
    productPrices,
    budgetSettings,
    isPricesLoading,
    isBudgetLoading,
    selectedQuantities,
    simulationTotal,
    setSimulationTotal,
    activeTab,
    setActiveTab,
    totalBudget,
    depositPercentage,
    depositAmount,
    remainingBudget,
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
    onCreateOrder
  };
}
