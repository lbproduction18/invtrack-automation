
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { type BudgetSettings } from "@/hooks/useBudgetSettings";

interface BudgetNotesActionsProps {
  budgetSettings: BudgetSettings | null;
  totalOrderAmount: number;
  onSettingChange: (field: string, value: string | number) => void;
  onCreateOrder: () => void;
}

const BudgetNotesActions: React.FC<BudgetNotesActionsProps> = ({
  budgetSettings,
  totalOrderAmount,
  onSettingChange,
  onCreateOrder
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="notes" className="text-sm text-gray-400">
          NOTES
        </Label>
        <Textarea
          id="notes"
          value={budgetSettings?.notes || ''}
          onChange={(e) => onSettingChange('notes', e.target.value)}
          placeholder="Ajoutez des notes concernant le budget..."
          className="mt-1 h-24 bg-[#212121]"
        />
      </div>
      
      <div>
        <Button 
          className="w-full"
          onClick={onCreateOrder}
          disabled={totalOrderAmount <= 0}
        >
          <ChevronRight className="mr-1 h-4 w-4" />
          Passer à la commande
        </Button>
      </div>
    </div>
  );
};

export default BudgetNotesActions;
