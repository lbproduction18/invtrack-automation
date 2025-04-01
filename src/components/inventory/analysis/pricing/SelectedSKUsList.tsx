
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectedSKUsListProps {
  productId: string;
  skus: string[];
  quantities: Record<string, string>;
  calculatedPrices: Record<string, number | string>;
  onQuantityChange: (productId: string, sku: string, quantityValue: string) => void;
  onRemoveSKU: (productId: string, sku: string) => void;
  hasOnlyPrice8000: boolean;
  showQuantityInputs?: boolean;
}

const SelectedSKUsList: React.FC<SelectedSKUsListProps> = ({
  productId,
  skus,
  quantities,
  calculatedPrices,
  onQuantityChange,
  onRemoveSKU,
  hasOnlyPrice8000,
  showQuantityInputs = true
}) => {
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, sku: string) => {
    onQuantityChange(productId, sku, event.target.value);
  };

  return (
    <div className="flex flex-col space-y-2 py-2 px-1">
      {skus.map((sku) => {
        const quantity = quantities[sku] || '';
        const price = calculatedPrices[sku] || 0;
        const isValid = quantity !== '' && parseFloat(quantity) > 0;
        
        return (
          <div 
            key={sku} 
            className={cn(
              "flex items-center justify-between bg-[#1A1A1A] px-3 py-2 rounded-md border border-[#2A2A2A]",
              "hover:border-[#3A3A3A] transition-all duration-200"
            )}
          >
            <div className="flex items-center space-x-3 flex-1">
              <span className="font-medium text-gray-300">{sku}</span>
              
              {showQuantityInputs && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-400">Quantité:</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e, sku)}
                    className={cn(
                      "w-24 bg-[#242424] border-[#2A2A2A] text-center rounded-md transition-colors",
                      "focus:border-primary focus:ring-1 focus:ring-primary/30",
                      isValid ? "border-green-600/30 hover:border-green-600/50" : "border-red-600/30 hover:border-red-600/50"
                    )}
                    required
                    aria-label={`Quantité pour ${sku}`}
                  />
                  {hasOnlyPrice8000 && (
                    <div className="text-xs text-yellow-500 italic">
                      Prix 8000 uniquement disponible
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {showQuantityInputs && (
                <span className={cn(
                  "font-semibold tabular-nums",
                  isValid ? "text-green-500" : "text-red-400"
                )}>
                  {typeof price === 'number' ? 
                    `${price.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}` :
                    price}
                </span>
              )}
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSKU(productId, sku)}
                className="h-8 w-8 p-0 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
                aria-label={`Supprimer ${sku}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedSKUsList;
