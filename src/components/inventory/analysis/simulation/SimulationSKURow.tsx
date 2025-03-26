
import React from 'react';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SimulationSKURowProps {
  sku: SelectedSKU;
  productName: string;
  index: number;
  quantityOptions: QuantityOption[];
  onQuantityChange: (productName: string, skuIndex: number, quantity: QuantityOption) => void;
  onRemoveSKU: (productName: string, skuIndex: number) => void;
  calculateSKUTotal: (sku: SelectedSKU) => number;
}

const SimulationSKURow: React.FC<SimulationSKURowProps> = ({
  sku,
  productName,
  index,
  quantityOptions,
  onQuantityChange,
  onRemoveSKU,
  calculateSKUTotal
}) => {
  const skuTotal = calculateSKUTotal(sku);
  
  return (
    <tr className="bg-[#1A1A1A] hover:bg-[#222]">
      <td className="py-2 pl-8 border-t border-[#272727] text-gray-300">
        {sku.SKU}
      </td>
      
      {/* Empty cells for price columns */}
      {quantityOptions.map(qty => (
        <td key={qty} className="text-center py-2 border-t border-[#272727]">
          {qty === sku.quantity ? (
            <span className="text-white font-medium">{sku.price.toLocaleString()} $</span>
          ) : ''}
        </td>
      ))}
      
      {/* Quantity selection and SKU total cell */}
      <td className="text-right py-2 border-t border-[#272727]">
        <div className="flex items-center justify-end space-x-2">
          <Select
            value={sku.quantity.toString()}
            onValueChange={(value) => onQuantityChange(productName, index, parseInt(value) as QuantityOption)}
          >
            <SelectTrigger className="w-28 h-8 bg-[#161616] border-[#272727]">
              <SelectValue placeholder="Quantité" />
            </SelectTrigger>
            <SelectContent className="bg-[#161616] border-[#272727] z-50">
              {quantityOptions.map(qty => (
                <SelectItem key={qty} value={qty.toString()}>
                  {qty.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span className="font-medium text-white min-w-28 text-right">
            {skuTotal > 0 ? `${skuTotal.toLocaleString()} $` : '0 $'}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-400"
            onClick={() => onRemoveSKU(productName, index)}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default SimulationSKURow;
