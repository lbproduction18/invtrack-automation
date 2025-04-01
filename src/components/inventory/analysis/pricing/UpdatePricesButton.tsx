
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, Tag } from 'lucide-react';
import { type AnalysisItem } from '@/types/analysisItem';
import { ProductPrice } from '@/hooks/useProductPrices';
import { usePriceUpdater } from './hooks/usePriceUpdater';

interface UpdatePricesButtonProps {
  productPrices: ProductPrice[];
  selectedSKUs: Record<string, string[]>;
  analysisItems: AnalysisItem[];
  className?: string;
}

const UpdatePricesButton: React.FC<UpdatePricesButtonProps> = ({
  productPrices,
  selectedSKUs,
  analysisItems,
  className
}) => {
  const { isLoading, isComplete, updatePrices } = usePriceUpdater({ 
    productPrices, 
    analysisItems 
  });

  const handleUpdatePrices = () => {
    updatePrices(selectedSKUs);
  };

  return (
    <Button 
      variant="default"
      size="lg"
      disabled={isLoading}
      onClick={handleUpdatePrices}
      className={`font-medium px-6 py-2 ${className}`}
    >
      {isLoading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Mise à jour en cours...
        </>
      ) : isComplete ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Prix mis à jour
        </>
      ) : (
        <>
          <Tag className="mr-2 h-4 w-4" />
          Associer les prix
        </>
      )}
    </Button>
  );
};

export default UpdatePricesButton;
