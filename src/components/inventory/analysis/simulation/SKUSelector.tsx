
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

interface SKUSelectorProps {
  availableSKUs: Array<{ id: string, SKU: string, productName: string | null }>;
  productName: string;
  quantityOptions: QuantityOption[];
  onAdd: (productName: string, skuId: string, skuValue: string, quantity: number) => void;
  prices: Record<number, number | null>;
}

const SKUSelector: React.FC<SKUSelectorProps> = ({
  availableSKUs,
  productName,
  quantityOptions,
  onAdd,
  prices
}) => {
  const [selectedSKU, setSelectedSKU] = useState<string | undefined>();
  const [selectedSKUData, setSelectedSKUData] = useState<{ id: string, SKU: string } | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<QuantityOption>(quantityOptions[0]);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  
  // Handle SKU selection
  const handleSKUChange = (value: string) => {
    setSelectedSKU(value);
    const skuData = availableSKUs.find(sku => sku.SKU === value);
    if (skuData) {
      setSelectedSKUData({
        id: skuData.id,
        SKU: skuData.SKU
      });
    }
    
    // Recalculate total
    calculateTotal(selectedQuantity, value);
  };
  
  // Handle quantity selection
  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value) as QuantityOption;
    setSelectedQuantity(quantity);
    
    // Recalculate total
    calculateTotal(quantity, selectedSKU);
  };
  
  // Calculate total
  const calculateTotal = (quantity: QuantityOption, sku?: string) => {
    if (!sku) return;
    
    const priceKey = `price_${quantity}` as keyof typeof prices;
    const price = prices[quantity] || 0;
    
    setCalculatedTotal(quantity * price);
  };
  
  // Handle add button click
  const handleAddClick = () => {
    if (selectedSKUData && selectedQuantity) {
      onAdd(
        productName, 
        selectedSKUData.id, 
        selectedSKUData.SKU, 
        selectedQuantity
      );
      
      // Reset selection after adding
      setSelectedSKU(undefined);
      setSelectedSKUData(null);
      setCalculatedTotal(0);
    }
  };
  
  // Check if there are any available SKUs
  if (availableSKUs.length === 0) {
    return (
      <span className="text-gray-500 text-sm">Aucun SKU disponible</span>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      {/* SKU Selection */}
      <Select value={selectedSKU} onValueChange={handleSKUChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Sélectionner un SKU" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-[#161616] border-[#272727]">
          {availableSKUs.map(sku => (
            <SelectItem key={sku.id} value={sku.SKU}>
              {sku.SKU}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Quantity Selection - Only shown when SKU is selected */}
      {selectedSKU && (
        <>
          <Select 
            value={selectedQuantity.toString()} 
            onValueChange={handleQuantityChange}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Quantité" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-[#161616] border-[#272727]">
              {quantityOptions.map(qty => (
                <SelectItem key={qty} value={qty.toString()}>
                  {qty.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Total Amount Display */}
          <div className="w-28 px-3 py-2 bg-[#1A1A1A] border border-[#272727] rounded-md">
            {calculatedTotal.toLocaleString()} $
          </div>
          
          {/* Add Button */}
          <Button 
            size="sm" 
            className="ml-2"
            onClick={handleAddClick}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </>
      )}
    </div>
  );
};

export default SKUSelector;
