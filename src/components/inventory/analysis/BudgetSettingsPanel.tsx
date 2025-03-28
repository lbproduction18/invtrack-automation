
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface BudgetSettingsPanelProps {
  totalOrderAmount?: number;
  depositAmount?: number;
  budgetPercentage?: number;
  onCreateOrder?: () => void;
}

const BudgetSettingsPanel: React.FC<BudgetSettingsPanelProps> = ({
  totalOrderAmount = 0,
  depositAmount = 0,
  budgetPercentage = 0,
  onCreateOrder = () => {}
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="border border-[#272727] bg-[#161616]">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-sm font-medium text-gray-300">Paramètres</h3>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="budget-total" className="text-xs text-gray-400 mb-1 block">
              Budget total
            </label>
            <Input 
              id="budget-total"
              type="number" 
              min={0}
              className="bg-[#121212] border-[#272727]"
              placeholder="300,000"
              value="300000"
              readOnly
            />
          </div>
          
          <div>
            <label htmlFor="deposit-percentage" className="text-xs text-gray-400 mb-1 block">
              Pourcentage d'acompte
            </label>
            <Input 
              id="deposit-percentage"
              type="number" 
              min={0}
              max={100}
              className="bg-[#121212] border-[#272727]"
              placeholder="50"
              value="50"
              readOnly
            />
          </div>
        </div>
        
        <Button 
          className="w-full"
          onClick={onCreateOrder}
          disabled={isLoading || totalOrderAmount <= 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            "Créer la commande"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BudgetSettingsPanel;
