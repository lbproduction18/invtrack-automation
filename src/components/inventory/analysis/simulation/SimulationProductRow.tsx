
import React from 'react';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { PlusCircle, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import SimulationSKURow from './SimulationSKURow';

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
              {price ? `${price.toLocaleString()} $` : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-gray-500 cursor-help inline-flex items-center">
                        -
                        <InfoIcon className="h-3 w-3 ml-1 opacity-50" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Prix non disponible</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </td>
          );
        })}
        
        {/* SKU Selection dropdown */}
        <td className="py-3 border-t border-[#272727]">
          {availableSKUs.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-between"
                >
                  <span className="flex-1 truncate">Ajouter une saveur</span>
                  <PlusCircle className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#161616] border-[#272727]">
                {availableSKUs.map(sku => (
                  <DropdownMenuItem 
                    key={sku.id}
                    onClick={() => onAddSKU(productName, sku)}
                  >
                    {sku.SKU}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-gray-500 text-sm">Aucun SKU disponible</span>
          )}
        </td>
        
        {/* Total for this product row (empty in main row) */}
        <td className="text-right py-3 border-t border-[#272727]"></td>
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
