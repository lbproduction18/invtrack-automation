
import React from 'react';
import BudgetSummary from '../BudgetSummary';
import BudgetMetrics from './BudgetMetrics';
import BudgetSettingsPanel from '../BudgetSettingsPanel';
import { Card, CardContent } from '@/components/ui/card';

interface BudgetSidePanelProps {
  productCount: number;
  totalBudget: number;
  configuredProductCount: number;
  totalProductCount: number;
  onCreateOrder: () => void;
  isLoading: boolean;
  simulationTotal: number;
  depositAmount: number;
  depositPercentage: number;
  budgetPercentage: number;
  remainingBudget: number;
}

const BudgetSidePanel: React.FC<BudgetSidePanelProps> = ({
  productCount,
  totalBudget,
  configuredProductCount,
  totalProductCount,
  onCreateOrder,
  isLoading,
  simulationTotal,
  depositAmount,
  depositPercentage,
  budgetPercentage,
  remainingBudget
}) => {
  return (
    <div className="space-y-4">
      <BudgetSummary
        productCount={productCount}
        totalBudget={totalBudget}
        configuredProductCount={configuredProductCount}
        totalProductCount={totalProductCount}
        onCreateOrder={onCreateOrder}
        isLoading={isLoading}
        totalOrderAmount={simulationTotal}
        depositAmount={depositAmount}
        budgetPercentage={budgetPercentage}
        budgetAmount={totalBudget}
      />
      
      <Card className="border border-[#272727] bg-[#161616]">
        <CardContent className="p-4">
          <BudgetMetrics 
            totalOrderAmount={simulationTotal}
            depositPercentage={depositPercentage}
            totalBudget={totalBudget}
            depositAmount={depositAmount}
            remainingBudget={remainingBudget}
            budgetPercentage={budgetPercentage}
          />
        </CardContent>
      </Card>
      
      <BudgetSettingsPanel 
        totalOrderAmount={simulationTotal}
        depositAmount={depositAmount}
        budgetPercentage={budgetPercentage}
        onCreateOrder={onCreateOrder}
      />
    </div>
  );
};

export default BudgetSidePanel;
