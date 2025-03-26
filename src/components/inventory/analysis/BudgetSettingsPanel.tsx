
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import BudgetSettingsForm from './budget/BudgetSettingsForm';
import BudgetMetrics from './budget/BudgetMetrics';
import BudgetNotesActions from './budget/BudgetNotesActions';
import BudgetLoadingState from './budget/BudgetLoadingState';

interface BudgetSettingsPanelProps {
  totalOrderAmount: number;
  onCreateOrder: () => void;
}

const BudgetSettingsPanel: React.FC<BudgetSettingsPanelProps> = ({
  totalOrderAmount,
  onCreateOrder
}) => {
  const { 
    budgetSettings, 
    isLoading,
    updateBudgetSettings
  } = useBudgetSettings();

  // Handle form input changes
  const handleSettingChange = (field: string, value: string | number) => {
    if (!budgetSettings) return;
    
    const updates: any = { ...budgetSettings };
    updates[field] = value;
    
    updateBudgetSettings.mutate(updates);
  };

  // Calculate budget metrics
  const depositAmount = budgetSettings ? totalOrderAmount * (budgetSettings.deposit_percentage / 100) : 0;
  const remainingBudget = budgetSettings ? budgetSettings.total_budget - totalOrderAmount : 0;
  const budgetPercentage = budgetSettings ? (totalOrderAmount / budgetSettings.total_budget) * 100 : 0;

  if (isLoading) {
    return <BudgetLoadingState />;
  }

  return (
    <Card className="border border-[#272727] bg-[#1A1A1A] shadow-md">
      <CardHeader className="pb-2 border-b border-[#272727]">
        <CardTitle className="text-lg font-medium">Résumé Budgétaire</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Budget Settings */}
          <BudgetSettingsForm 
            budgetSettings={budgetSettings} 
            onSettingChange={handleSettingChange} 
          />
          
          {/* Middle Column - Budget Metrics */}
          <BudgetMetrics 
            totalOrderAmount={totalOrderAmount}
            depositPercentage={budgetSettings?.deposit_percentage || 0}
            totalBudget={budgetSettings?.total_budget || 0}
            depositAmount={depositAmount}
            remainingBudget={remainingBudget}
            budgetPercentage={budgetPercentage}
          />
          
          {/* Right Column - Notes and Actions */}
          <BudgetNotesActions 
            budgetSettings={budgetSettings} 
            totalOrderAmount={totalOrderAmount}
            onSettingChange={handleSettingChange}
            onCreateOrder={onCreateOrder}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSettingsPanel;
