
import React, { useMemo, useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductPrice } from '@/hooks/useProductPrices';
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { type SelectedSKU } from '@/types/product';
import SelectedSKUsList from './SelectedSKUsList';

interface PriceTableRowProps {
  product: ProductPrice;
  selectedSKUs: Record<string, SelectedSKU[]>;
  quantities: Record<string, string>;
  calculatedPrices: Record<string, number | string>;
  analysisProductSKUs: Array<{ id: string, SKU: string }>;
  handleSKUSelect: (productId: string, sku: string, skuProductId: string) => void;
  handleQuantityChange: (productId: string, quantityValue: string) => void;
  removeSKU: (productId: string, sku: string) => void;
  formatPrice: (price: number | null) => React.ReactNode;
  formatTotalPrice: (price: number) => string;
}

const PriceTableRow: React.FC<PriceTableRowProps> = ({
  product,
  selectedSKUs,
  quantities,
  calculatedPrices,
  analysisProductSKUs,
  handleSKUSelect,
  handleQuantityChange,
  removeSKU,
  formatPrice,
  formatTotalPrice
}) => {
  // Check if this product only has price_8000 defined
  const onlyHas8000 = 
    (!product.price_1000 || product.price_1000 === 0) && 
    (!product.price_2000 || product.price_2000 === 0) && 
    (!product.price_3000 || product.price_3000 === 0) && 
    (!product.price_4000 || product.price_4000 === 0) && 
    (!product.price_5000 || product.price_5000 === 0) && 
    (product.price_8000 && product.price_8000 > 0);

  // Get currently selected SKUs for this product
  const productSelectedSKUs = selectedSKUs[product.id] || [];
  
  // Filter out already selected SKUs from the dropdown
  const availableSKUs = useMemo(() => {
    const allSelectedSKUs = new Set<string>();
    
    // Collect all selected SKUs from all products
    Object.values(selectedSKUs).forEach(skuArray => {
      skuArray.forEach(sku => allSelectedSKUs.add(sku.SKU));
    });
    
    // Return only SKUs that haven't been selected yet
    return analysisProductSKUs.filter(sku => !allSelectedSKUs.has(sku.SKU));
  }, [analysisProductSKUs, selectedSKUs]);

  return (
    <>
      <TableRow className="hover:bg-[#161616] border-t border-[#272727]">
        <TableCell className="font-medium">{product.product_name}</TableCell>
        <TableCell className="text-center">{formatPrice(product.price_1000)}</TableCell>
        <TableCell className="text-center">{formatPrice(product.price_2000)}</TableCell>
        <TableCell className="text-center">{formatPrice(product.price_3000)}</TableCell>
        <TableCell className="text-center">{formatPrice(product.price_4000)}</TableCell>
        <TableCell className="text-center">{formatPrice(product.price_5000)}</TableCell>
        <TableCell className="text-center">{formatPrice(product.price_8000)}</TableCell>
        <TableCell className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full px-3 py-1 text-sm border border-input rounded-md bg-[#161616] hover:bg-[#272727]">
              Sélectionner SKU
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[200px] overflow-y-auto bg-[#161616] border-[#272727]">
              {availableSKUs.length === 0 ? (
                <DropdownMenuItem disabled className="text-gray-500">
                  Aucun SKU disponible
                </DropdownMenuItem>
              ) : (
                availableSKUs.map((skuItem) => (
                  <DropdownMenuItem 
                    key={skuItem.SKU}
                    onClick={() => handleSKUSelect(product.id, skuItem.SKU, skuItem.id)}
                    className="cursor-pointer hover:bg-[#272727]"
                  >
                    {skuItem.SKU}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Display selected SKUs list */}
          <SelectedSKUsList 
            skus={productSelectedSKUs}
            formatTotalPrice={formatTotalPrice}
            onRemove={(sku) => removeSKU(product.id, sku)}
          />
        </TableCell>
        <TableCell className="text-center">
          <Input
            type="number"
            placeholder="Quantité"
            value={quantities[product.id] || ''}
            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
            className="w-24 h-8 mx-auto bg-[#161616] border-[#272727] text-center"
            min="1"
            // If product only has price_8000, restrict to exactly 8000
            {...(onlyHas8000 ? { 
              value: '8000', 
              readOnly: true,
              className: "w-24 h-8 mx-auto bg-[#232323] border-[#272727] text-center" 
            } : {})}
          />
        </TableCell>
        <TableCell className="text-center font-medium">
          {typeof calculatedPrices[product.id] === 'number' ? 
            formatTotalPrice(calculatedPrices[product.id] as number) : 
            calculatedPrices[product.id] ? 
              <span className="text-yellow-500 text-xs">{calculatedPrices[product.id]}</span> : 
              <span className="text-gray-500">–</span>}
        </TableCell>
      </TableRow>
    </>
  );
};

export default PriceTableRow;
