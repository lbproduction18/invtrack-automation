
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatTotalPrice } from './PriceFormatter';

interface SelectedSKUsListProps {
  productId?: string;
  skus?: string[];
  quantities?: Record<string, string>;
  calculatedPrices?: Record<string, number | string>;
  onQuantityChange?: (productId: string, sku: string, quantityValue: string) => void;
  onRemoveSKU?: (productId: string, sku: string) => void;
  hasOnlyPrice8000?: boolean;
}

const SelectedSKUsList: React.FC<SelectedSKUsListProps> = ({
  productId = '',
  skus = [],
  quantities = {},
  calculatedPrices = {},
  onQuantityChange = () => {},
  onRemoveSKU = () => {},
  hasOnlyPrice8000 = false
}) => {
  if (!skus || skus.length === 0) return null;

  return (
    <div className="mt-2 space-y-2 pl-4">
      {skus.map((sku) => (
        <div 
          key={sku} 
          className="flex items-center gap-2 px-2 py-1.5 bg-[#161616] border border-[#272727] rounded text-sm"
        >
          <div className="flex-1 font-medium truncate">{sku}</div>
          <div className="flex-shrink-0 w-24">
            <Input
              type="number"
              placeholder="Quantité"
              value={quantities[sku] || ''}
              onChange={(e) => onQuantityChange(productId, sku, e.target.value)}
              className="h-7 w-full bg-[#161616] border-[#272727] text-center text-xs"
              min="1"
              {...(hasOnlyPrice8000 ? { 
                value: '8000', 
                readOnly: true,
                className: "h-7 w-full bg-[#232323] border-[#272727] text-center text-xs" 
              } : {})}
            />
          </div>
          <div className="flex-shrink-0 w-24 text-right">
            {typeof calculatedPrices[sku] === 'number' ? 
              formatTotalPrice(calculatedPrices[sku] as number) : 
              calculatedPrices[sku] ? 
                <span className="text-yellow-500 text-xs">{calculatedPrices[sku]}</span> : 
                <span className="text-gray-500">–</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-red-400"
            onClick={() => onRemoveSKU(productId, sku)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SelectedSKUsList;
