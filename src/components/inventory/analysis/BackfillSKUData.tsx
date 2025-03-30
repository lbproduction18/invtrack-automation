
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Database, Check, Tag } from 'lucide-react';
import { useBackfillAnalysisItems } from '@/hooks/useBackfillAnalysisItems';
import { useToast } from '@/hooks/use-toast';

const BackfillSKUData: React.FC = () => {
  const { backfillSKUData, associatePrices, isLoading, isComplete, isPriceAssociationLoading, isPriceAssociationComplete } = useBackfillAnalysisItems();
  const { toast } = useToast();

  const handleBackfill = () => {
    backfillSKUData();
    toast({
      title: "Synchronisation démarrée",
      description: "La mise à jour des données SKU est en cours...",
    });
  };

  const handleAssociatePrices = () => {
    associatePrices();
    toast({
      title: "Association des prix démarrée",
      description: "L'association des prix aux SKUs est en cours...",
    });
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Button 
        variant="outline" 
        size="sm"
        disabled={isLoading || isComplete}
        onClick={handleBackfill}
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
            Synchroniser SKUs uniquement
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        disabled={isPriceAssociationLoading || isPriceAssociationComplete}
        onClick={handleAssociatePrices}
        className="text-xs h-8"
      >
        {isPriceAssociationLoading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Association en cours...
          </>
        ) : isPriceAssociationComplete ? (
          <>
            <Check className="mr-2 h-3 w-3 text-green-500" />
            Association terminée
          </>
        ) : (
          <>
            <Tag className="mr-2 h-3 w-3" />
            Associer les prix
          </>
        )}
      </Button>
      
      {!isLoading && !isComplete && !isPriceAssociationLoading && !isPriceAssociationComplete && (
        <p className="text-xs text-muted-foreground">
          Cliquez pour mettre à jour les SKUs ou associer les prix dans la base de données
        </p>
      )}
    </div>
  );
};

export default BackfillSKUData;
