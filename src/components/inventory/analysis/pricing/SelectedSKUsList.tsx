
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type SelectedSKU } from '@/types/product';

interface SelectedSKUsListProps {
  skus: SelectedSKU[];
  formatTotalPrice: (price: number) => string;
  onRemove: (sku: string) => void;
}

const SelectedSKUsList: React.FC<SelectedSKUsListProps> = ({
  skus,
  formatTotalPrice,
  onRemove
}) => {
  if (skus.length === 0) return null;

  return (
    <div className="mt-2 space-y-1 pl-4 border-l-2 border-[#272727]">
      {skus.map(sku => {
        const totalPrice = sku.quantity * sku.price;
        
        return (
          <div key={sku.SKU} className="flex items-center justify-between text-sm py-1 pl-2 pr-1 rounded-sm bg-[#1A1A1A]">
            <div className="font-medium">{sku.SKU}</div>
            <div className="flex items-center space-x-3">
              <div className="text-gray-400">{sku.quantity.toLocaleString()}</div>
              <div className="font-medium">{formatTotalPrice(totalPrice)}</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:bg-[#272727] hover:text-red-400"
                onClick={() => onRemove(sku.SKU)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedSKUsList;
