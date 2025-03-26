
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import BudgetSummary from './BudgetSummary';
import { useBudgetSettings } from '@/hooks/useBudgetSettings';

export interface BudgetSettingsPanelProps {
  totalOrderAmount: number;
  depositAmount: number;
  budgetPercentage: number;
  onCreateOrder: () => void;
  configuredProductCount?: number;
  totalProductCount?: number;
}

const BudgetSettingsPanel: React.FC<BudgetSettingsPanelProps> = ({
  totalOrderAmount,
  depositAmount,
  budgetPercentage,
  onCreateOrder,
  configuredProductCount = 0,
  totalProductCount = 0
}) => {
  const { budgetSettings, isLoading } = useBudgetSettings();
  
  return (
    <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Budget Summary Section */}
          <div className="flex-1">
            <BudgetSummary
              isLoading={isLoading}
              totalOrderAmount={totalOrderAmount}
              depositAmount={depositAmount}
              budgetPercentage={budgetPercentage}
              configuredProductCount={configuredProductCount}
              totalProductCount={totalProductCount}
              productCount={totalProductCount || 0}
              totalBudget={budgetSettings?.total_budget || 300000}
              budgetAmount={budgetSettings?.total_budget}
              onCreateOrder={onCreateOrder}
            />
          </div>
          
          {/* Actions Section */}
          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Vous pouvez créer un bon de commande à tout moment.</p>
              <Button 
                onClick={onCreateOrder}
                className="w-full"
                disabled={totalOrderAmount <= 0}
              >
                <BookCheck className="mr-2 h-4 w-4" />
                Créer bon de commande
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              disabled={totalOrderAmount <= 0}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Passer à la prochaine étape
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSettingsPanel;
