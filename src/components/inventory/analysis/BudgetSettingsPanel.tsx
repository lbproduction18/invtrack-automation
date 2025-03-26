
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, Save, Sparkles } from "lucide-react";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";

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
    return (
      <Card className="border border-[#272727] bg-[#161616] shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-[#272727] rounded w-1/2"></div>
            <div className="h-10 bg-[#272727] rounded"></div>
            <div className="h-10 bg-[#272727] rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[#272727] rounded w-full"></div>
              <div className="h-4 bg-[#272727] rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[#272727] bg-[#161616] shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Résumé Budgétaire</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget Input */}
        <div>
          <Label htmlFor="budget" className="text-sm text-gray-400">
            BUDGET POUR LE BON DE COMMANDE
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="budget"
              type="number"
              value={budgetSettings?.total_budget || 0}
              onChange={(e) => handleSettingChange('total_budget', parseFloat(e.target.value) || 0)}
              className="bg-[#1A1A1A]"
            />
            <span className="text-sm">€</span>
          </div>
        </div>
        
        {/* Deposit Percentage */}
        <div>
          <Label htmlFor="deposit" className="text-sm text-gray-400">
            POURCENTAGE DU DÉPÔT
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="deposit"
              type="number"
              value={budgetSettings?.deposit_percentage || 0}
              onChange={(e) => handleSettingChange('deposit_percentage', parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              className="bg-[#1A1A1A]"
            />
            <span className="text-sm">%</span>
          </div>
        </div>
        
        {/* Budget Summary */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
            <span className="text-gray-400">TOTAL DU BON DE COMMANDE</span>
            <span className="font-medium">{totalOrderAmount.toLocaleString()} €</span>
          </div>
          
          <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
            <span className="text-gray-400">TOTAL DÉPÔT ({budgetSettings?.deposit_percentage || 0}%)</span>
            <span className="font-medium">{depositAmount.toLocaleString()} €</span>
          </div>
          
          <div className="flex justify-between text-sm border-b border-[#272727] pb-1">
            <span className="text-gray-400">BUDGET CASH RESTANT</span>
            <span className={`font-medium ${remainingBudget < 0 ? 'text-red-400' : ''}`}>
              {remainingBudget.toLocaleString()} €
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
        
        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-sm text-gray-400">
            NOTES
          </Label>
          <Textarea
            id="notes"
            value={budgetSettings?.notes || ''}
            onChange={(e) => handleSettingChange('notes', e.target.value)}
            placeholder="Ajoutez des notes concernant le budget..."
            className="mt-1 h-24 bg-[#1A1A1A]"
          />
        </div>
        
        {/* Action buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            className="w-full"
            onClick={onCreateOrder}
            disabled={totalOrderAmount <= 0}
          >
            <ChevronRight className="mr-1 h-4 w-4" />
            Passer à la commande
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={true} // Will be enabled in future
          >
            <Sparkles className="mr-1 h-4 w-4" />
            Optimiser avec l'IA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSettingsPanel;
