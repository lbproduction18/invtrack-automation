
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { BudgetSettings } from '@/hooks/useBudgetSettings';
import { useAISimulationMetadata } from '@/hooks/useAISimulationMetadata';

interface BudgetSettingsFormProps {
  budgetSettings?: BudgetSettings;
  isLoading?: boolean;
  onSave?: (updates: Partial<BudgetSettings>) => Promise<void>;
}

const BudgetSettingsForm: React.FC<BudgetSettingsFormProps> = ({
  budgetSettings,
  isLoading = false,
  onSave
}) => {
  const [totalBudget, setTotalBudget] = useState<number>(500000);
  const [depositPercentage, setDepositPercentage] = useState<number>(50);
  const [notes, setNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Get AI simulation metadata to sync with it
  const { 
    metadata: aiMetadata, 
    isLoading: isLoadingAI,
    saveSimulationSettings
  } = useAISimulationMetadata();

  // Initialize form with existing settings
  useEffect(() => {
    if (budgetSettings) {
      setTotalBudget(budgetSettings.total_budget);
      setDepositPercentage(budgetSettings.deposit_percentage);
      setNotes(budgetSettings.notes || "");
    }
  }, [budgetSettings]);

  // Sync with AI metadata if available
  useEffect(() => {
    if (aiMetadata && !isLoadingAI) {
      if (aiMetadata.budget_max && aiMetadata.budget_max !== totalBudget) {
        setTotalBudget(aiMetadata.budget_max);
      }
      
      if (aiMetadata.ai_note && (!notes || notes === 'Budget initial')) {
        setNotes(aiMetadata.ai_note);
      }
    }
  }, [aiMetadata, isLoadingAI]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Save to both systems for now during transition
      if (onSave) {
        await onSave({
          total_budget: totalBudget,
          deposit_percentage: depositPercentage,
          notes: notes
        });
      }
      
      // Also save to AI simulation metadata - will update existing record
      await saveSimulationSettings({
        budget_max: totalBudget,
        ai_note: notes
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-[#272727] bg-[#161616]">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="total-budget" className="text-sm text-gray-300">Budget Total</Label>
              <Input
                id="total-budget"
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="bg-[#121212] border-[#272727]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deposit-percentage" className="text-sm text-gray-300">Pourcentage d'acompte</Label>
              <Input
                id="deposit-percentage"
                type="number"
                min={0}
                max={100}
                value={depositPercentage}
                onChange={(e) => setDepositPercentage(Number(e.target.value))}
                className="bg-[#121212] border-[#272727]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm text-gray-300">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Notes importantes concernant cette simulation..."
                className="bg-[#121212] border-[#272727] resize-none"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetSettingsForm;
