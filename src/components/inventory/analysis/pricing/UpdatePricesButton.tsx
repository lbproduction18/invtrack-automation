
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
      variant="outline" 
      size="sm"
      disabled={isLoading}
      onClick={handleUpdatePrices}
      className={`text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222] ${className}`}
    >
      {isLoading ? (
        <>
          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
          Mise à jour en cours...
        </>
      ) : isComplete ? (
        <>
          <Check className="mr-2 h-3 w-3 text-green-500" />
          Prix mis à jour
        </>
      ) : (
        <>
          <Tag className="mr-2 h-3 w-3" />
          Associer les prix
        </>
      )}
    </Button>
  );
};

export default UpdatePricesButton;
