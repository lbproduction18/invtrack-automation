
import React from 'react';
import { type SelectedSKU } from '@/types/product';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <tr className="bg-[#141414] hover:bg-[#181818]">
      <td className="pl-8 text-gray-400 text-sm py-2 border-t border-[#272727]">
        {sku.SKU}
      </td>
      
      {/* Empty cells for price columns */}
      {quantityOptions.map(qty => (
        <td key={qty} className="py-2 border-t border-[#272727]"></td>
      ))}
      
      {/* Quantity selection for this SKU */}
      <td className="py-2 border-t border-[#272727]">
        <Select
          value={sku.quantity ? sku.quantity.toString() : ""}
          onValueChange={(value) => {
            if (value) {
              onQuantityChange(productName, index, parseInt(value) as QuantityOption);
            }
          }}
        >
          <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
            <SelectValue placeholder="Quantité" />
          </SelectTrigger>
          <SelectContent className="bg-[#161616] border-[#272727]">
            {quantityOptions.map(qty => (
              <SelectItem key={qty} value={qty.toString()}>
                {qty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      
      {/* Total price and remove button */}
      <td className="text-right py-2 border-t border-[#272727]">
        <div className="flex items-center justify-end gap-2">
          <span className="font-medium">
            {calculateSKUTotal(sku) > 0 ? 
              `${calculateSKUTotal(sku).toLocaleString()} $ CAD` : 
              '-'
            }
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveSKU(productName, index)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default SimulationSKURow;
