
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { useSimulationState } from '@/hooks/useSimulationState';

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
  
  return {
    totalBudget,
    depositPercentage,
    depositAmount,
    remainingBudget,
    budgetPercentage
  };
}
