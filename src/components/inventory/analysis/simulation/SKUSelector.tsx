
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SKUSelectorProps {
  productGroups: Record<string, Array<{ id: string, SKU: string, productName: string | null }>>;
  productName: string;
  onAddSKU: (productName: string, sku: string, skuId: string) => void;
  disabled?: boolean;
}

const SKUSelector: React.FC<SKUSelectorProps> = ({ 
  productGroups, 
  productName,
  onAddSKU,
  disabled = false
}) => {
  const [availableSKUs, setAvailableSKUs] = useState<Array<{ id: string, SKU: string, productName: string | null }>>([]);
  const [selectedSKU, setSelectedSKU] = useState<string>('');
  
  // Filter SKUs based on the current product
  useEffect(() => {
    // Extract base product name (before any dash) to match with product groups
    const baseProductName = productName.split('–')[0]?.trim() || productName;
    
    // Find matching product group
    const matchingSKUs = productGroups[baseProductName] || [];
    setAvailableSKUs(matchingSKUs);
  }, [productGroups, productName]);
  
  // Handle SKU selection
  const handleSkuChange = (value: string) => {
    setSelectedSKU(value);
    
    // Find the selected SKU object
    const selectedSkuObject = availableSKUs.find(sku => sku.SKU === value);
    
    if (selectedSkuObject) {
      // Call the onAddSKU with the selected SKU information
      onAddSKU(productName, value, selectedSkuObject.id);
    }
    
    // Reset selection after adding
    setSelectedSKU('');
  };
  
  return (
    <div className="w-full">
      <Select
        value={selectedSKU}
        onValueChange={(value) => handleSkuChange(value)}
        disabled={disabled || availableSKUs.length === 0}
      >
        <SelectTrigger className="w-full bg-[#121212] border-[#272727] text-gray-300">
          <SelectValue placeholder="SKU..." />
        </SelectTrigger>
        <SelectContent className="bg-[#161616] border-[#272727]">
          {availableSKUs.length > 0 ? (
            availableSKUs.map((sku) => (
              <SelectItem 
                key={sku.id} 
                value={sku.SKU}
                className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]"
              >
                {sku.SKU}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled className="text-gray-500">
              Aucun SKU disponible
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SKUSelector;
