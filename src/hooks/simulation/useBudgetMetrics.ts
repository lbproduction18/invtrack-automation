
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { useSimulationState } from '@/hooks/useSimulationState';
import { getUnitPriceForSKU as skuPriceHelperGetUnitPrice } from '@/hooks/simulation/skuPriceHelpers';
import { ProductPrice } from '@/hooks/useProductPrices';

/**
 * Hook to calculate budget metrics based on the simulation total
 */
export function useBudgetMetrics(simulationTotal: number) {
  const { budgetSettings } = useBudgetSettings();
  const { calculateBudgetPercentage } = useSimulationState();
  
  // Calculate budget metrics
  const totalBudget = budgetSettings?.total_budget || 300000;
  const depositPercentage = budgetSettings?.deposit_percentage || 50;
  const depositAmount = (simulationTotal * depositPercentage) / 100;
  const remainingBudget = totalBudget - simulationTotal;
  const budgetPercentage = calculateBudgetPercentage(totalBudget);
  
  // Create a wrapper for getUnitPriceForSKU to match the expected signature
  const getUnitPriceWrapper = (productId: string, sku: string, quantity?: string): number => {
    // When no quantity is provided, default to 1000
    const numericQuantity = quantity ? parseInt(quantity, 10) : 1000;
    // Use an empty array for productPrices as it will be populated later
    const dummyProductPrices: ProductPrice[] = [];
    // Call the utility function
    return skuPriceHelperGetUnitPrice(dummyProductPrices, sku, numericQuantity);
  };
  
  return {
    totalBudget,
    depositPercentage,
    depositAmount,
    remainingBudget,
    budgetPercentage,
    getUnitPriceWrapper
  };
}
