
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

export interface SKUSelectorProps {
  productName: string;
  skus?: Array<{ id: string; SKU: string; productName: string | null }>;
  availableSKUs?: Array<{ id: string; SKU: string; productName: string | null }>;
  quantityOptions: QuantityOption[];
  prices?: Record<string, number | null>;
  onAdd: (productName: string, skuId: string, skuValue: string, quantity: QuantityOption) => void;
}

const SKUSelector: React.FC<SKUSelectorProps> = ({
  productName,
  quantityOptions,
  onAdd,
  availableSKUs = [],
  skus = [],
  prices = {}
}) => {
  const [selectedSKU, setSelectedSKU] = useState<string>('');
  const [selectedSKUObject, setSelectedSKUObject] = useState<{ id: string; SKU: string; productName: string | null } | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<QuantityOption | null>(null);

  // Use either availableSKUs or skus depending on what's provided
  const skusToDisplay = availableSKUs.length > 0 ? availableSKUs : skus;

  const handleSKUChange = (value: string) => {
    setSelectedSKU(value);
    const skuObject = skusToDisplay.find(sku => sku.SKU === value) || null;
    setSelectedSKUObject(skuObject);
    setSelectedQuantity(null); // Reset quantity when SKU changes
  };

  const handleQuantityChange = (value: string) => {
    setSelectedQuantity(Number(value) as QuantityOption);
  };

  const handleAddClick = () => {
    if (selectedSKU && selectedQuantity && selectedSKUObject) {
      onAdd(productName, selectedSKUObject.id, selectedSKU, selectedQuantity);
      // Reset after adding
      setSelectedSKU('');
      setSelectedSKUObject(null);
      setSelectedQuantity(null);
    }
  };

  return (
    <div className="flex space-x-2 items-center">
      <div className="w-40">
        <Select value={selectedSKU} onValueChange={handleSKUChange}>
          <SelectTrigger className="w-full bg-[#161616]">
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            {skusToDisplay.map((sku) => (
              <SelectItem key={sku.id} value={sku.SKU}>
                {sku.SKU}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSKU && (
        <>
          <div className="w-24">
            <Select onValueChange={handleQuantityChange}>
              <SelectTrigger className="w-full bg-[#161616]">
                <SelectValue placeholder="Qté" />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map((qty) => (
                  <SelectItem key={qty} value={qty.toString()}>
                    {qty.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleAddClick}
            disabled={!selectedQuantity}
            className="h-9 w-9"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default SKUSelector;
