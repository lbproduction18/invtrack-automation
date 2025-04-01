
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAISimulationMetadata } from '@/hooks/useAISimulationMetadata';
import { formatPrice } from '@/components/inventory/analysis/pricing/PriceFormatter';

interface BudgetSettingsFormProps {
  onClose?: () => void;
}

const BudgetSettingsForm: React.FC<BudgetSettingsFormProps> = ({ onClose }) => {
  const { metadata, saveMetadata } = useAISimulationMetadata();
  
  const [budget, setBudget] = useState<number>(metadata?.budget_max || 500000);
  const [notes, setNotes] = useState<string>(metadata?.ai_note || '');
  const [label, setLabel] = useState<string>(metadata?.simulation_label || 'Default Simulation');
  
  const handleSaveSettings = async () => {
    try {
      await saveMetadata({
        budget_max: budget,
        ai_note: notes,
        simulation_label: label
      });
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to save budget settings:', error);
    }
  };
  
  return (
    <div className="space-y-4 p-1">
      <div className="space-y-2">
        <Label htmlFor="simulation-name">Nom de la simulation</Label>
        <Input
          id="simulation-name"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="bg-[#161616] border-[#272727]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="budget-amount">Budget maximal</Label>
        <div className="flex items-center gap-3">
          <Input
            id="budget-amount"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="bg-[#161616] border-[#272727]"
          />
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {formatPrice(budget)}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="budget-notes">Notes</Label>
        <Textarea
          id="budget-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ajoutez des instructions spécifiques pour l'analyse AI..."
          className="bg-[#161616] border-[#272727] min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end pt-2">
        {onClose && (
          <Button variant="outline" onClick={onClose} className="mr-2">
            Annuler
          </Button>
        )}
        <Button onClick={handleSaveSettings}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default BudgetSettingsForm;
