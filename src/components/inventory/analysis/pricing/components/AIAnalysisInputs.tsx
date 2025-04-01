
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain } from 'lucide-react';
import { formatTotalPrice } from '../PriceFormatter';
import { useAISimulationMetadata } from '@/hooks/useAISimulationMetadata';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AIAnalysisInputsProps {
  budget: number;
  onBudgetChange: (value: number) => void;
  notes: string;
  onNotesChange: (value: string) => void;
}

const AIAnalysisInputs: React.FC<AIAnalysisInputsProps> = ({
  budget,
  onBudgetChange,
  notes,
  onNotesChange
}) => {
  const { 
    metadata, 
    isLoading, 
    saveSimulationSettings 
  } = useAISimulationMetadata();
  const [isSaving, setIsSaving] = useState(false);
  const [localBudget, setLocalBudget] = useState(budget);
  const [localNotes, setLocalNotes] = useState(notes);

  // Initialize with database values when they're loaded
  useEffect(() => {
    if (metadata && !isLoading) {
      if (metadata.budget_max && metadata.budget_max !== budget) {
        setLocalBudget(metadata.budget_max);
        onBudgetChange(metadata.budget_max);
      }
      
      if (metadata.ai_note !== null && metadata.ai_note !== notes) {
        setLocalNotes(metadata.ai_note);
        onNotesChange(metadata.ai_note);
      }
    }
  }, [metadata, isLoading]);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    setLocalBudget(newValue);
    onBudgetChange(newValue);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNotes(e.target.value);
    onNotesChange(e.target.value);
  };

  // Updated save handler to always update the existing record
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSimulationSettings({
        budget_max: localBudget,
        ai_note: localNotes
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-md border border-[#272727] bg-[#161616] p-5 space-y-5 shadow-sm">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="budget-slider" className="text-sm font-medium text-gray-300">
            Budget maximum pour cette simulation
          </Label>
          <span className="text-primary font-medium tabular-nums">
            {formatTotalPrice(localBudget)}
          </span>
        </div>
        <Slider
          id="budget-slider"
          min={0}
          max={1000000}
          step={10000}
          value={[localBudget]}
          onValueChange={handleSliderChange}
          className="py-4"
        />
      </div>
      
      <div className="space-y-2">
        <Label 
          htmlFor="ai-notes" 
          className="flex items-center gap-2 text-sm font-medium text-gray-300"
        >
          <Brain className="h-4 w-4 text-primary" />
          Notes importantes à transmettre à l'IA
        </Label>
        <Textarea 
          id="ai-notes"
          value={localNotes || ''}
          onChange={handleNotesChange}
          placeholder="Ex: Favoriser les formats économiques. Éviter les produits à base de caféine."
          className="min-h-[100px] bg-background border border-[#272727] focus:border-primary focus:ring-primary"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-400 italic">
          Ces données seront utilisées pour guider l'analyse automatisée.
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving || isLoading}
          size="sm"
          className="text-xs"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Sauvegarde...
            </>
          ) : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
};

export default AIAnalysisInputs;
