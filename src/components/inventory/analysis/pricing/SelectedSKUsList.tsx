
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

interface SelectedSKUsListProps {
  productId: string;
  skus: string[];
  quantities: Record<string, string>;
  calculatedPrices: Record<string, number | string>;
  onQuantityChange: (productId: string, sku: string, quantity: string) => void;
  onRemoveSKU: (productId: string, sku: string) => void;
  hasOnlyPrice8000?: boolean;
  showQuantityInputs?: boolean;
}

const SelectedSKUsList: React.FC<SelectedSKUsListProps> = ({
  productId,
  skus,
  quantities,
  calculatedPrices,
  onQuantityChange,
  onRemoveSKU,
  hasOnlyPrice8000 = false,
  showQuantityInputs = true
}) => {
  const { analysisItems } = useAnalysisItems();

  return (
    <div className="space-y-2 pb-2">
      <div className="text-xs text-gray-400 mb-2">SKUs sélectionnés:</div>
      <div className="space-y-2">
        {skus.map((sku) => {
          // Find SKU details from analysis items
          const skuDetails = analysisItems.find(item => item.sku_code === sku);
          const skuLabel = skuDetails?.sku_label || sku;
          
          // Get current quantity for this SKU (or empty string if not set)
          const currentQuantity = quantities[sku] || '';
          
          // Get the calculated price for this SKU
          const calculatedPrice = calculatedPrices[sku];
          
          return (
            <div key={sku} className="flex items-center space-x-3 pl-3 py-1 bg-[#1A1A1A] rounded-sm">
              <div className="flex-1 flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-300">{sku}</span>
                {skuLabel !== sku && (
                  <span className="text-xs text-gray-400">({skuLabel})</span>
                )}
              </div>
              
              {showQuantityInputs && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Quantité:</span>
                    <Input
                      type="number"
                      min="1"
                      step={hasOnlyPrice8000 ? "8000" : "1000"}
                      value={currentQuantity}
                      onChange={(e) => onQuantityChange(productId, sku, e.target.value)}
                      className="w-24 h-7 text-xs bg-[#161616] border-[#272727]"
                      placeholder={hasOnlyPrice8000 ? "8000" : "1000+"}
                    />
                  </div>
                  
                  {calculatedPrice !== undefined && calculatedPrice !== 0 && (
                    <div className="text-xs text-gray-300">
                      {typeof calculatedPrice === 'number'
                        ? `$${calculatedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : calculatedPrice}
                    </div>
                  )}
                </>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSKU(productId, sku)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectedSKUsList;
