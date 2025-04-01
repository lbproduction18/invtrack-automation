
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Loader2, ChevronDown, ChevronUp, PlusSquare, Trash } from "lucide-react";
import { type ProductPrice } from '@/hooks/useProductPrices';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import SimulationSKURow from './SimulationSKURow';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SimulationProductRowProps {
  productName: string;
  productPrices: ProductPrice[];
  isLoading: boolean;
  quantityOptions: QuantityOption[];
  selectedSKUs: Record<string, SelectedSKU[]>;
  groupedSKUs: Array<{ id: string; SKU: string; productName: string }>;
  onAddSKU: (productName: string, skuInfo: { id: string; SKU: string; productName: string }) => void;
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
  const skusForProduct = selectedSKUs[productName] || [];
  const hasSKUs = skusForProduct.length > 0;

  return (
    <>
      <TableRow className="relative">
        <TableCell className="font-medium pl-4">{productName}</TableCell>
        <TableCell colSpan={quantityOptions.length + 1} className="p-0 relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="flex items-center justify-around">
              {quantityOptions.map((quantityOption, index) => {
                const totalForQuantity = skusForProduct.reduce((sum, sku) => {
                  if (sku.quantity === quantityOption) {
                    return sum + calculateSKUTotal(sku);
                  }
                  return sum;
                }, 0);

                return (
                  <div key={index} className="text-center">
                    {totalForQuantity > 0 ? `$${totalForQuantity.toFixed(2)}` : '-'}
                  </div>
                );
              })}
            </div>
          )}
        </TableCell>
        <TableCell className="text-right pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <PlusSquare className="h-4 w-4 mr-2" />
                Ajouter un SKU
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {groupedSKUs.map(skuInfo => (
                <DropdownMenuItem key={skuInfo.SKU} onClick={() => onAddSKU(productName, skuInfo)}>
                  {skuInfo.SKU}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {skusForProduct.map((sku, index) => (
        <SimulationSKURow
          key={sku.SKU}
          sku={sku}
          productName={productName}
          index={index}
          quantityOptions={quantityOptions}
          onQuantityChange={(quantity) => onQuantityChange(productName, index, quantity)}
          onRemoveSKU={() => onRemoveSKU(productName, index)}
          calculateSKUTotal={calculateSKUTotal}
        />
      ))}
    </>
  );
};

export default SimulationProductRow;
