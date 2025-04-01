
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCw, Loader2 } from "lucide-react";
import UpdatePricesButton from '../UpdatePricesButton';
import { ProductPrice } from '@/hooks/useProductPrices';
import { AnalysisItem } from '@/hooks/useAnalysisItems';

interface PricingGridHeaderProps {
  handleRefresh: () => Promise<void>;
  handleResetSimulation: () => Promise<void>;
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
  analysisMode,
  productPrices,
  selectedSKUs,
  analysisItems
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-sm font-medium">Grille Tarifaire</CardTitle>
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResetSimulation}
          disabled={isResetting}
          className="text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222]"
        >
          {isResetting ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <RotateCw className="mr-2 h-3 w-3" />
          )}
          Réinitialiser
        </Button>
        
        {analysisMode === 'ai' && (
          <UpdatePricesButton 
            productPrices={productPrices}
            selectedSKUs={selectedSKUs}
            analysisItems={analysisItems}
          />
        )}
      </div>
    </div>
  );
};

export default PricingGridHeader;
