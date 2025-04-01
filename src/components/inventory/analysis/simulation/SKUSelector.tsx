
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { cn } from '@/lib/utils';

interface SKUSelectorProps {
  productName: string;
  availableSKUs: Array<{ id: string; SKU: string; productName: string | null }>;
  quantityOptions: QuantityOption[];
  prices: Record<string, number | null>;
  onAdd: (productName: string, skuId: string, skuValue: string, quantity: QuantityOption) => void;
}

const SKUSelector: React.FC<SKUSelectorProps> = ({
  productName,
  availableSKUs,
  quantityOptions,
  prices,
  onAdd
}) => {
  const [selectedSKU, setSelectedSKU] = React.useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = React.useState<QuantityOption>(1000);
  
  const handleAddSKU = () => {
    if (selectedSKU) {
      const skuObj = availableSKUs.find(sku => sku.SKU === selectedSKU);
      if (skuObj) {
        onAdd(productName, skuObj.id, selectedSKU, selectedQuantity);
        setSelectedSKU('');
      }
    }
  };
  
  const handleSKUChange = (value: string) => {
    setSelectedSKU(value);
    // If a SKU is selected, automatically add it
    if (value) {
      const skuObj = availableSKUs.find(sku => sku.SKU === value);
      if (skuObj) {
        onAdd(productName, skuObj.id, value, selectedQuantity);
        setSelectedSKU('');
      }
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Select value={selectedSKU} onValueChange={handleSKUChange}>
        <SelectTrigger 
          className={cn(
            "w-full bg-[#1A1A1A] border-[#2A2A2A] rounded-md",
            "hover:bg-[#222] hover:border-[#3ECF8E] transition-colors duration-200",
            "focus:ring-1 focus:ring-primary/30"
          )}
        >
          <SelectValue placeholder="Ajouter SKU" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto bg-[#1A1A1A] border-[#2A2A2A] rounded-md shadow-lg">
          {availableSKUs.length === 0 ? (
            <div className="py-2 px-2 text-sm text-gray-500">Aucun SKU disponible</div>
          ) : (
            availableSKUs.map((sku) => (
              <SelectItem 
                key={sku.SKU} 
                value={sku.SKU}
                className="cursor-pointer hover:bg-[#2A2A2A]"
              >
                {sku.SKU}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SKUSelector;
