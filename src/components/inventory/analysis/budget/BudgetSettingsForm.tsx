
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type BudgetSettings } from "@/hooks/useBudgetSettings";

interface BudgetSettingsFormProps {
  budgetSettings: BudgetSettings | null;
  onSettingChange: (field: keyof BudgetSettings, value: string | number) => void;
}

const BudgetSettingsForm: React.FC<BudgetSettingsFormProps> = ({
  budgetSettings,
  onSettingChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="budget" className="text-sm text-gray-400">
          BUDGET POUR LE BON DE COMMANDE
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="budget"
            type="number"
            value={budgetSettings?.total_budget || 0}
            onChange={(e) => onSettingChange('total_budget', parseFloat(e.target.value) || 0)}
            className="bg-[#212121]"
          />
          <span className="text-sm">$ CAD</span>
        </div>
      </div>
      
      <div>
        <Label htmlFor="deposit" className="text-sm text-gray-400">
          POURCENTAGE DU DÉPÔT
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <Input
            id="deposit"
            type="number"
            value={budgetSettings?.deposit_percentage || 0}
            onChange={(e) => onSettingChange('deposit_percentage', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            className="bg-[#212121]"
          />
          <span className="text-sm">%</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSettingsForm;
