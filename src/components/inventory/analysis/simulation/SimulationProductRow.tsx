
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { type ProductPrice } from '@/hooks/useProductPrices';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import SimulationSKURow from './SimulationSKURow';
import SKUSelector from './SKUSelector';

interface SimulationProductRowProps {
  productName: string;
  productPrices: ProductPrice[];
  isLoading: boolean;
  quantityOptions: QuantityOption[];
  selectedSKUs: Record<string, SelectedSKU[]>;
  groupedSKUs: Array<{ id: string; SKU: string; productName: string | null }>;
  onAddSKU: (productName: string, skuInfo: { id: string; SKU: string; productName: string | null }) => void;
  onQuantityChange: (productName: string, skuIndex: number, quantity: QuantityOption) => void;
  onRemoveSKU: (productName: string, skuIndex: number) => void;
  calculateSKUTotal: (sku: SelectedSKU) => number;
}

const SimulationProductRow: React.FC<SimulationProductRowProps> = ({
  productName,
  productPrices,
  isLoading,
  quantityOptions,
  selectedSKUs,
  groupedSKUs,
  onAddSKU,
  onQuantityChange,
  onRemoveSKU,
  calculateSKUTotal
}) => {
  const productPrice = productPrices.find(price => price.product_name === productName);
  
  // Prepare the prices object for the product
  const prices: Record<string, number | null> = {};
  quantityOptions.forEach(qty => {
    const priceKey = `price_${qty}` as keyof typeof productPrice;
    prices[qty.toString()] = productPrice ? productPrice[priceKey] as number | null : null;
  });
  
  // Handle adding a SKU with a specific quantity
  const handleAddSKUWithQuantity = (productName: string, skuId: string, skuValue: string, quantity: QuantityOption) => {
    // Find the SKU object
    const skuInfo = groupedSKUs.find(sku => sku.SKU === skuValue);
    if (!skuInfo) return;
    
    // Add the SKU
    onAddSKU(productName, skuInfo);
    
    // If adding was successful and we have selectedSKUs for this product
    if (selectedSKUs[productName]?.length > 0) {
      // Find the index of the newly added SKU (should be the last one)
      const newSkuIndex = selectedSKUs[productName].length - 1;
      
      // Update its quantity
      onQuantityChange(productName, newSkuIndex, quantity);
    }
  };
  
  return (
    <>
      {/* Main product row */}
      <TableRow className="border-b border-[#272727]">
        <TableCell className="font-medium">{productName}</TableCell>
        
        {/* Price cells for each quantity option */}
        {quantityOptions.map(qty => (
          <TableCell key={qty} className="text-right">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              <>
                {productPrice && productPrice[`price_${qty}` as keyof typeof productPrice] ? 
                  `${(productPrice[`price_${qty}` as keyof typeof productPrice] as number).toLocaleString()} €` : 
                  '—'
                }
              </>
            )}
          </TableCell>
        ))}
        
        {/* SKU selector cell */}
        <TableCell>
          <SKUSelector
            productName={productName}
            availableSKUs={groupedSKUs}
            quantityOptions={quantityOptions}
            prices={prices}
            onAdd={handleAddSKUWithQuantity}
          />
        </TableCell>
      </TableRow>
      
      {/* SKU rows for this product */}
      {selectedSKUs[productName]?.map((sku, index) => (
        <SimulationSKURow
          key={`${sku.SKU}-${index}`}
          sku={sku}
          productName={productName}
          index={index}
          quantityOptions={quantityOptions}
          onQuantityChange={onQuantityChange}
          onRemoveSKU={onRemoveSKU}
          calculateSKUTotal={calculateSKUTotal}
        />
      ))}
    </>
  );
};

export default SimulationProductRow;
