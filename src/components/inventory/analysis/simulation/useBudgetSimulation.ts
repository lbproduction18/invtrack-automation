
import { useState } from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useSimulationState } from '@/hooks/useSimulationState';
import { useSimulationSKUs } from '@/hooks/useSimulationSKUs';
import { useQuantitySelection } from '@/hooks/simulation/useQuantitySelection';
import { useSimulationTabs } from '@/hooks/simulation/useSimulationTabs';
import { useBudgetMetrics } from '@/hooks/simulation/useBudgetMetrics';
import { useProductCategories } from '@/hooks/simulation/useProductCategories';
import { useSyncSkuFromAnalysis } from '@/hooks/simulation/useSyncSkuFromAnalysis';
import { useAISimulationMetadata } from '@/hooks/useAISimulationMetadata';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

export function useBudgetSimulation(onCreateOrder: () => void) {
  const { productPrices, productPricesByName, isLoading: isPricesLoading, refetch } = useProductPrices();
  const { budgetSettings, isLoading: isBudgetLoading } = useBudgetSettings();
  const { metadata: aiMetadata, isLoading: isAIMetadataLoading } = useAISimulationMetadata();
  
  // Use our custom hooks for simulation state and management
  const { activeTab, setActiveTab } = useSimulationTabs();
  const { products, groupedAnalysisProducts } = useProductCategories();
  
  // Use our simulation state hook
  const {
    simulationTotal,
    selectedSKUs,
    setSelectedSKUs,
    calculateSKUTotal,
    calculateBudgetPercentage
  } = useSimulationState();
  
  // Use our SKU management hook
  const {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange,
  } = useSimulationSKUs(selectedSKUs, setSelectedSKUs, productPrices);
  
  // Use our quantity selection hook
  const { selectedQuantities, handleOrderQuantityChange } = useQuantitySelection();
  
  // Use our budget metrics hook with AI metadata override
  const {
    totalBudget,
    depositPercentage,
    depositAmount,
    remainingBudget,
    budgetPercentage,
    getUnitPriceWrapper
  } = useBudgetMetrics(simulationTotal, aiMetadata?.budget_max);
  
  // Sync SKUs from analysis items
  const adaptedHandleOrderQuantityChange = (productId: string, quantityValue: string) => {
    // Convert string to QuantityOption
    const qty = Number(quantityValue) as QuantityOption;
    return handleOrderQuantityChange(productId, qty);
  };
  
  useSyncSkuFromAnalysis(setSelectedSKUs, adaptedHandleOrderQuantityChange);
  
  // Handle refresh button click
  const handleRefresh = async (): Promise<void> => {
    return refetch();
  };

  return {
    products,
    budgetSettings,
    aiMetadata,
    isPricesLoading,
    isBudgetLoading,
    isAIMetadataLoading,
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
    calculateSKUTotal,
    getUnitPriceForSKU: getUnitPriceWrapper
  };
}
