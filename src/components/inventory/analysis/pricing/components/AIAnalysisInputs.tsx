
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain } from 'lucide-react';
import { formatTotalPrice } from '../PriceFormatter';

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
  const handleSliderChange = (values: number[]) => {
    onBudgetChange(values[0]);
  };

  return (
    <div className="rounded-md border border-[#272727] bg-[#161616] p-5 space-y-5 shadow-sm">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="budget-slider" className="text-sm font-medium text-gray-300">
            Budget maximum pour cette simulation
          </Label>
          <span className="text-primary font-medium tabular-nums">
            {formatTotalPrice(budget)}
          </span>
        </div>
        <Slider
          id="budget-slider"
          min={0}
          max={1000000}
          step={10000}
          value={[budget]}
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
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Ex: Favoriser les formats économiques. Éviter les produits à base de caféine."
          className="min-h-[100px] bg-background border border-[#272727] focus:border-primary focus:ring-primary"
        />
      </div>
      
      <div className="text-xs text-gray-400 italic">
        Ces données seront utilisées pour guider l'analyse automatisée.
      </div>
    </div>
  );
};

export default AIAnalysisInputs;
