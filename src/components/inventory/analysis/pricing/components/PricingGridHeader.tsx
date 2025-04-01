
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, RotateCw } from 'lucide-react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { type AnalysisItem } from '@/types/analysisItem';

interface PricingGridHeaderProps {
  handleRefresh: () => void;
  handleResetSimulation: () => void;
  isResetting: boolean;
  analysisMode: 'manual' | 'ai';
  productPrices: ProductPrice[];
  selectedSKUs: Record<string, string[]>;
  analysisItems: AnalysisItem[];
}

const PricingGridHeader: React.FC<PricingGridHeaderProps> = ({
  handleRefresh,
  handleResetSimulation,
  isResetting,
  analysisMode
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm font-medium">
        Grille Tarifaire {analysisMode === 'ai' ? '(Mode AI)' : ''}
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          className="text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222]"
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          Rafraîchir
        </Button>
        {/* Only show Réinitialiser button in manual mode */}
        {analysisMode === 'manual' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetSimulation}
            disabled={isResetting}
            className="text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222]"
          >
            <RotateCw className="mr-2 h-3 w-3" />
            {isResetting ? 'Réinitialisation...' : 'Réinitialiser'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PricingGridHeader;
