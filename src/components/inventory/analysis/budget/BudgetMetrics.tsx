
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface BudgetMetricsProps {
  totalOrderAmount: number;
  depositPercentage: number;
  totalBudget: number;
  depositAmount: number;
  remainingBudget: number;
  budgetPercentage: number;
}

const BudgetMetrics: React.FC<BudgetMetricsProps> = ({
  totalOrderAmount,
  depositPercentage,
  depositAmount,
  remainingBudget,
  budgetPercentage
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
        <span className="text-gray-400">TOTAL DU BON DE COMMANDE</span>
        <span className="font-medium">{totalOrderAmount.toLocaleString()} $</span>
      </div>
      
      <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
        <span className="text-gray-400">TOTAL DÉPÔT ({depositPercentage}%)</span>
        <span className="font-medium">{depositAmount.toLocaleString()} $</span>
      </div>
      
      <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
        <span className="text-gray-400">BUDGET CASH RESTANT</span>
        <span className={`font-medium ${remainingBudget < 0 ? 'text-red-400' : ''}`}>
          {remainingBudget.toLocaleString()} $
        </span>
      </div>
      
      <div className="text-sm pb-1">
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">% DÉPENSÉ DU BUDGET</span>
          <span className="font-medium">{budgetPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={Math.min(budgetPercentage, 100)} className="h-2" />
      </div>
    </div>
  );
};

export default BudgetMetrics;
