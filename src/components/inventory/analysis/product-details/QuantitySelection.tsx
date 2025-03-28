
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type Product } from "@/types/product";

interface QuantitySelectionProps {
  product: Product & { selectedQuantity?: QuantityOption };
  onQuantityChange: (productId: string, quantity: QuantityOption) => void;
  quantityOptions: QuantityOption[];
  getTotalPrice: (product: Product & { selectedQuantity?: QuantityOption }) => number;
}

const QuantitySelection: React.FC<QuantitySelectionProps> = ({
  product,
  onQuantityChange,
  quantityOptions,
  getTotalPrice
}) => {
  return (
    <div className="bg-[#1A1A1A] p-3 rounded-md mb-3">
      <div className="text-sm mb-2">Quantité à commander:</div>
      <Select
        value={product.selectedQuantity?.toString() || undefined}
        onValueChange={(value) => {
          if (value) {
            const qty = parseInt(value) as QuantityOption;
            onQuantityChange(product.id, qty);
          }
        }}
      >
        <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
          <SelectValue placeholder="Choisir une quantité" />
        </SelectTrigger>
        <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
          {quantityOptions.map(qty => (
            <SelectItem key={qty} value={qty.toString()}>
              {qty}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {product.selectedQuantity && (
        <div className="mt-2 text-right">
          <div className="text-xs text-gray-400">Prix total:</div>
          <div className="font-medium">{getTotalPrice(product).toLocaleString()} $</div>
          <div className="text-xs text-gray-400">
            {(getTotalPrice(product) / product.selectedQuantity * 1000).toFixed(2)} $ / 1000
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantitySelection;
