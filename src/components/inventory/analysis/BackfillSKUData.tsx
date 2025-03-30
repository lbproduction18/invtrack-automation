
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Database, Check } from 'lucide-react';
import { useBackfillAnalysisItems } from '@/hooks/useBackfillAnalysisItems';

const BackfillSKUData: React.FC = () => {
  const { backfillSKUData, isLoading, isComplete } = useBackfillAnalysisItems();

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button 
        variant="outline" 
        size="sm"
        disabled={isLoading || isComplete}
        onClick={backfillSKUData}
        className="text-xs h-8"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Mise à jour en cours...
          </>
        ) : isComplete ? (
          <>
            <Check className="mr-2 h-3 w-3 text-green-500" />
            Synchronisation terminée
          </>
        ) : (
          <>
            <Database className="mr-2 h-3 w-3" />
            Synchroniser les données SKU
          </>
        )}
      </Button>
      
      {!isLoading && !isComplete && (
        <p className="text-xs text-muted-foreground">
          Cliquez pour mettre à jour les SKUs manquants dans la base de données
        </p>
      )}
    </div>
  );
};

export default BackfillSKUData;
