
import { useState, useEffect } from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { useSimulationState } from '@/hooks/useSimulationState';
import { useSimulationSKUs } from '@/hooks/useSimulationSKUs';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

export function useBudgetSimulation(onCreateOrder: () => void) {
  const { productPrices, productPricesByName, isLoading: isPricesLoading, refetch } = useProductPrices();
  const { budgetSettings, isLoading: isBudgetLoading } = useBudgetSettings();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('analysis');
  const [activeTab, setActiveTab] = useState<string>('configuration');
  
  // Use our custom hooks for simulation state and SKU management
  const {
    simulationTotal,
    selectedSKUs,
    setSelectedSKUs,
    calculateSKUTotal,
    calculateBudgetPercentage
  } = useSimulationState();
  
  const {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange,
  } = useSimulationSKUs(selectedSKUs, setSelectedSKUs, productPrices);
  
  // Store quantity selections for each product (as strings for input field binding)
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, string>>({});
  
  // Predefined quantity options
  const standardQuantities: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];
  
  // Calculate budget metrics
  const totalBudget = budgetSettings?.total_budget || 0;
  const depositPercentage = budgetSettings?.deposit_percentage || 50;
  const depositAmount = (simulationTotal * depositPercentage) / 100;
  const remainingBudget = totalBudget - simulationTotal;
  const budgetPercentage = calculateBudgetPercentage(totalBudget);
  
  // Group analysis products by category
  const groupedAnalysisProducts = products.reduce((acc, product) => {
    // Extract category from SKU (e.g., "COLLAGENE" from "COLLAGENE-LOTUS")
    const skuParts = product.SKU.split('-');
    const category = skuParts[0] || 'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);
  
  // Handle order quantity change for a product
  const handleOrderQuantityChange = (productId: string, quantityValue: string) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: quantityValue
    }));
  };
  
  // Sync product quantities from analysis_items to the simulation on component load
  useEffect(() => {
    // Get product quantities from analysis_items
    const quantities: Record<string, string> = {};
    
    // Also prepare to sync SKUs from analysis_items
    const syncedSKUs: Record<string, any[]> = {};
    
    analysisItems.forEach(item => {
      if (item.product_id && item.quantity_selected) {
        quantities[item.product_id] = item.quantity_selected.toString();
      }
      
      // If this analysis item has SKU information, sync it
      if (item.product_id && item.sku_code && item.sku_label) {
        const productInfo = products.find(p => p.id === item.product_id);
        if (productInfo) {
          // Find appropriate category/price entry for this SKU
          const skuParts = item.sku_code.split('-');
          const category = skuParts[0];
          
          // Find matching product price 
          const matchingPrice = productPrices.find(p => {
            const normalizedPriceName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const normalizedCategory = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return normalizedPriceName.includes(normalizedCategory) || normalizedCategory.includes(normalizedPriceName);
          });
          
          if (matchingPrice) {
            if (!syncedSKUs[matchingPrice.product_name]) {
              syncedSKUs[matchingPrice.product_name] = [];
            }
            
            // Get appropriate price based on quantity
            const quantity = item.quantity_selected as QuantityOption || 1000;
            const priceField = `price_${quantity}` as keyof typeof matchingPrice;
            const price = matchingPrice[priceField] as number || 0;
            
            syncedSKUs[matchingPrice.product_name].push({
              productId: item.product_id,
              SKU: item.sku_code,
              productName: item.sku_label,
              quantity: quantity,
              price: price
            });
          }
        }
      }
    });
    
    setSelectedQuantities(quantities);
    
    // If we have synced SKUs, update the selected SKUs state
    if (Object.keys(syncedSKUs).length > 0) {
      setSelectedSKUs(syncedSKUs);
    }
  }, [analysisItems, products, productPrices]);

  // Handle refresh button click - ensure this returns a Promise<void>
  const handleRefresh = async (): Promise<void> => {
    return refetch();
  };

  return {
    products,
    budgetSettings,
    isPricesLoading,
    isBudgetLoading,
    selectedQuantities,
    simulationTotal,
    setSimulationTotal: (value: number) => simulationTotal,
    activeTab,
    setActiveTab,
    totalBudget,
    depositPercentage,
    depositAmount,
    remainingBudget,
    budgetPercentage,
    groupedAnalysisProducts,
    selectedSKUs,
    productPrices,
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange,
    handleOrderQuantityChange,
    handleRefresh,
    calculateSKUTotal
  };
}
