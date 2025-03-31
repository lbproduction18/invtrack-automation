
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Trash2 } from 'lucide-react';

interface SelectedProductsBarProps {
  selectedCount: number;
  onSendToAnalysis: () => void;
  onDelete: () => void;
  isAnalysisPending: boolean;
}

export const SelectedProductsBar: React.FC<SelectedProductsBarProps> = ({
  selectedCount,
  onSendToAnalysis,
  onDelete,
  isAnalysisPending
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="flex items-center justify-between bg-muted/30 border border-border/50 p-2 rounded-md mb-2">
      <span className="text-sm font-medium px-2">
        {selectedCount} produit(s) sélectionné(s)
      </span>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSendToAnalysis}
          className="gap-1"
          disabled={isAnalysisPending}
        >
          <ChevronRight className="h-4 w-4" /> 
          Envoyer à l'analyse
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onDelete}
          className="gap-1"
        >
          <Trash2 className="h-4 w-4" /> 
          Supprimer
        </Button>
      </div>
    </div>
  );
};
