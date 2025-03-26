
import React from 'react';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { MinusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimulationSKURow from './SimulationSKURow';
import SKUSelector from './SKUSelector';

interface SimulationProductRowProps {
  product: any; // ProductPrice type
  productName: string;
  quantityOptions: QuantityOption[];
  availableSKUs: Array<{ id: string, SKU: string, productName: string | null }>;
  selectedSKUs: SelectedSKU[];
  onAddSKU: (productName: string, skuInfo: { id: string, SKU: string, productName: string | null }) => void;
  onQuantityChange: (productName: string, skuIndex: number, quantity: QuantityOption) => void;
  onRemoveSKU: (productName: string, skuIndex: number) => void;
  calculateSKUTotal: (sku: SelectedSKU) => number;
}

const SimulationProductRow: React.FC<SimulationProductRowProps> = ({
  product,
  productName,
  quantityOptions,
  availableSKUs,
  selectedSKUs,
  onAddSKU,
  onQuantityChange,
  onRemoveSKU,
  calculateSKUTotal
}) => {
  const hasSKUs = selectedSKUs && selectedSKUs.length > 0;
  
  // Create a record of prices for this product
  const prices: Record<number, number> = {};
  quantityOptions.forEach(qty => {
    const priceField = `price_${qty}` as keyof typeof product;
    prices[qty] = product[priceField] as number || 0;
  });
  
  // Handle adding a new SKU with selected quantity
  const handleAddWithQuantity = (
    productName: string, 
    skuId: string, 
    skuValue: string, 
    quantity: QuantityOption
  ) => {
    const skuInfo = availableSKUs.find(sku => sku.id === skuId);
    if (skuInfo) {
      onAddSKU(productName, skuInfo);
      
      // Find the newly added SKU and update its quantity
      setTimeout(() => {
        const newSKUs = selectedSKUs || [];
        const newSkuIndex = newSKUs.findIndex(sku => sku.SKU === skuValue);
        if (newSkuIndex !== -1) {
          onQuantityChange(productName, newSkuIndex, quantity);
        }
      }, 0);
    }
  };
  
  return (
    <React.Fragment>
      {/* Main product row */}
      <tr className="hover:bg-[#161616]">
        <td className="font-medium py-3 border-t border-[#272727]">{productName}</td>
        
        {/* Price cells for each quantity option */}
        {quantityOptions.map(qty => {
          const priceField = `price_${qty}` as keyof typeof product;
          const price = product[priceField] as number;
          
          return (
            <td key={qty} className="text-center py-3 border-t border-[#272727]">
              {price ? `${price.toLocaleString()} $` : "-"}
            </td>
          );
        })}
        
        {/* SKU Selection dropdown - placed at the right side */}
        <td className="py-3 border-t border-[#272727] text-right">
          <SKUSelector
            availableSKUs={availableSKUs}
            productName={productName}
            quantityOptions={quantityOptions}
            onAdd={handleAddWithQuantity}
            prices={prices}
          />
        </td>
      </tr>
      
      {/* SKU rows if any are selected */}
      {hasSKUs && selectedSKUs.map((sku, index) => (
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
    </React.Fragment>
  );
};

export default SimulationProductRow;
