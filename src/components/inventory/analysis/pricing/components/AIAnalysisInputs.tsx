
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useAISimulationMetadata } from '@/hooks/useAISimulationMetadata';
import { formatPrice } from '../PriceFormatter';

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
  const { metadata, saveMetadata } = useAISimulationMetadata();

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      onBudgetChange(value);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onNotesChange(e.target.value);
  };

  const handleSaveSettings = async () => {
    await saveMetadata({
      budget_max: budget,
      ai_note: notes
    });
  };

  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium">
            Budget maximal
          </label>
          <div className="flex items-center gap-3">
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              className="bg-[#161616] border-[#272727] text-white"
            />
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formatPrice(budget)}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="ai-notes" className="text-sm font-medium">
            Notes pour l'analyse AI
          </label>
          <Textarea
            id="ai-notes"
            placeholder="Ajoutez des détails ou des instructions spécifiques pour l'analyse..."
            rows={5}
            value={notes}
            onChange={handleNotesChange}
            className="bg-[#161616] border-[#272727] text-white"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSaveSettings}
          className="ml-auto flex items-center gap-1"
        >
          <Save size={16} />
          <span>Sauvegarder</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisInputs;
