
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, Tag, RotateCw } from 'lucide-react';
import { type AnalysisItem } from '@/types/analysisItem';
import { ProductPrice } from '@/hooks/useProductPrices';
import { usePriceUpdater } from './hooks/usePriceUpdater';

interface UpdatePricesButtonProps {
  productPrices: ProductPrice[];
  selectedSKUs: Record<string, string[]>;
  analysisItems: AnalysisItem[];
  className?: string;
  showResetButton?: boolean;
  onReset?: () => void;
  isResetting?: boolean;
}

const UpdatePricesButton: React.FC<UpdatePricesButtonProps> = ({
  productPrices,
  selectedSKUs,
  analysisItems,
  className,
  showResetButton = false,
  onReset,
  isResetting = false
}) => {
  const { isLoading, isComplete, updatePrices } = usePriceUpdater({ 
    productPrices, 
    analysisItems 
  });

  const handleUpdatePrices = () => {
    updatePrices(selectedSKUs);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {showResetButton && (
        <Button 
          variant="outline"
          size="lg"
          disabled={isResetting}
          onClick={onReset}
          className="font-medium px-6 py-2 border-[#272727] bg-[#161616] hover:bg-[#222]"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          {isResetting ? 'Réinitialisation...' : 'Réinitialiser'}
        </Button>
      )}
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
    </div>
  );
};

export default UpdatePricesButton;
