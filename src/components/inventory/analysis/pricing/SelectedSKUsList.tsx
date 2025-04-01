
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatTotalPrice } from './PriceFormatter';

interface SelectedSKUsListProps {
  productId: string;
  skus: string[];
  quantities: Record<string, string>;
  calculatedPrices: Record<string, number | string>;
  onQuantityChange: (productId: string, sku: string, quantityValue: string) => void;
  onRemoveSKU: (productId: string, sku: string) => void;
  hasOnlyPrice8000?: boolean;
  showQuantityInputs?: boolean;
  analysisMode?: 'manual' | 'ai';
}

const SelectedSKUsList: React.FC<SelectedSKUsListProps> = ({
  productId,
  skus,
  quantities,
  calculatedPrices,
  onQuantityChange,
  onRemoveSKU,
  hasOnlyPrice8000 = false,
  showQuantityInputs = true,
  analysisMode = 'manual'
}) => {
  // Handle quantity input change
  const handleQuantityChange = (sku: string, value: string) => {
    // Only allow positive numbers
    if (value === "" || /^\d+$/.test(value)) {
      onQuantityChange(productId, sku, value);
    }
  };
  
  return (
    <div className="ml-8 mb-3 space-y-2">
      {skus.map(sku => (
        <div key={sku} className="flex items-center gap-4">
          <span className="font-medium text-sm text-gray-400 min-w-[200px]">{sku}</span>
          
          {/* Only show quantity inputs in manual mode */}
          {analysisMode === 'manual' && showQuantityInputs ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="number"
                value={quantities[sku] || ""}
                onChange={(e) => handleQuantityChange(sku, e.target.value)}
                placeholder={hasOnlyPrice8000 ? "8000" : "Quantité..."}
                min="1"
                className="w-28 h-8 bg-[#161616] border-[#272727] text-sm"
                required
              />
              <span className="text-gray-400 text-sm">unités</span>
            </div>
          ) : analysisMode === 'manual' ? (
            <div className="flex-1">
              <span className="text-gray-400 text-sm">{quantities[sku] || "0"} unités</span>
            </div>
          ) : (
            <div className="flex-1">
              {/* In AI mode, don't show quantities at all */}
            </div>
          )}
          
          {/* Only show calculated prices in manual mode */}
          {analysisMode === 'manual' && (
            <div className="text-right min-w-[120px]">
              {calculatedPrices[sku] ? 
                <span className="font-medium">{typeof calculatedPrices[sku] === 'string' ? 
                  calculatedPrices[sku] : 
                  formatTotalPrice(calculatedPrices[sku] as number)}
                </span> : 
                <span className="text-gray-500">—</span>
              }
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveSKU(productId, sku)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-destructive hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {/* Only show 8000 units warning in manual mode */}
      {analysisMode === 'manual' && hasOnlyPrice8000 && (
        <div className="text-amber-400 text-xs italic ml-1 mt-1">
          Ce produit n'est disponible qu'en quantité exacte de 8000 unités.
        </div>
      )}
    </div>
  );
};

export default SelectedSKUsList;
