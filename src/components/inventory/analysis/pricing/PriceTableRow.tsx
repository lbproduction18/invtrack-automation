
import React, { useMemo } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductPrice } from '@/hooks/useProductPrices';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import SelectedSKUsList from './SelectedSKUsList';
import { formatTotalPrice } from './PriceFormatter';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { cn } from '@/lib/utils';

interface PriceTableRowProps {
  product: ProductPrice;
  selectedSKUs: Record<string, string[]>;
  quantities: Record<string, Record<string, string>>;
  calculatedPrices: Record<string, Record<string, number | string>>;
  analysisProductSKUs: Array<{ id: string, SKU: string }>;
  handleSKUSelect: (productId: string, sku: string) => void;
  handleSKURemove: (productId: string, sku: string) => void;
  handleQuantityChange: (productId: string, sku: string, quantityValue: string) => void;
  getTotalForProduct: (productId: string) => number;
  formatPrice: (price: number | null) => React.ReactNode;
  formatTotalPrice: (price: number) => string;
  showQuantityInputs?: boolean;
  isAlternate?: boolean;
}

const PriceTableRow: React.FC<PriceTableRowProps> = ({
  product,
  selectedSKUs,
  quantities,
  calculatedPrices,
  analysisProductSKUs,
  handleSKUSelect,
  handleSKURemove,
  handleQuantityChange,
  getTotalForProduct,
  formatPrice,
  formatTotalPrice,
  showQuantityInputs = true,
  isAlternate = false
}) => {
  // Get analysis items directly from Supabase via the hook
  const { analysisItems } = useAnalysisItems();
  
  // Check if this product only has price_8000 defined
  const onlyHas8000 = 
    (!product.price_1000 || product.price_1000 === 0) && 
    (!product.price_2000 || product.price_2000 === 0) && 
    (!product.price_3000 || product.price_3000 === 0) && 
    (!product.price_4000 || product.price_4000 === 0) && 
    (!product.price_5000 || product.price_5000 === 0) && 
    (product.price_8000 && product.price_8000 > 0);

  // Get the SKUs that have already been selected for this product
  const productSelectedSKUs = selectedSKUs[product.id] || [];
  
  // Get all selected SKUs across the entire table
  const allSelectedSKUs = Object.values(selectedSKUs).flat();
  
  // Get all available SKUs from analysisItems that aren't already selected elsewhere
  const availableSKUsFromAnalysis = useMemo(() => {
    // Get all SKUs from analysis_items that aren't already selected
    return analysisItems
      .filter(item => item.sku_code && !allSelectedSKUs.includes(item.sku_code))
      .map(item => ({
        id: item.product_id || '',
        SKU: item.sku_code || '',
        productName: item.sku_label
      }))
      .sort((a, b) => a.SKU.localeCompare(b.SKU)); // Sort alphabetically
  }, [analysisItems, allSelectedSKUs]);

  // Get the total price for all SKUs in this product row
  const rowTotal = getTotalForProduct(product.id);
  
  // For UI styling based on state
  const hasSKUs = productSelectedSKUs.length > 0;

  return (
    <>
      <TableRow className={cn(
        "transition-colors duration-200 border-t border-[#2A2A2A]",
        isAlternate ? "bg-[#161616]" : "bg-[#131313]",
        "hover:bg-[#1A1A1A]",
        hasSKUs && "border-b-0"
      )}>
        <TableCell className="font-medium pl-4 py-3">{product.product_name}</TableCell>
        <TableCell className="text-center py-3">{formatPrice(product.price_1000)}</TableCell>
        <TableCell className="text-center py-3">{formatPrice(product.price_2000)}</TableCell>
        <TableCell className="text-center py-3">{formatPrice(product.price_3000)}</TableCell>
        <TableCell className="text-center py-3">{formatPrice(product.price_4000)}</TableCell>
        <TableCell className="text-center py-3">{formatPrice(product.price_5000)}</TableCell>
        <TableCell className="text-center py-3">{formatPrice(product.price_8000)}</TableCell>
        <TableCell className="text-center py-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full px-3 py-2 text-sm border border-[#2A2A2A] rounded-md bg-[#1A1A1A] hover:bg-[#222] hover:border-[#3ECF8E] transition-colors duration-200">
              {availableSKUsFromAnalysis.length > 0 ? 'Ajouter SKU' : 'Aucun SKU disponible'}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[200px] overflow-y-auto bg-[#1A1A1A] border-[#2A2A2A] z-[100] rounded-md shadow-lg">
              {availableSKUsFromAnalysis.map((skuItem) => (
                <DropdownMenuItem 
                  key={skuItem.SKU}
                  onClick={() => handleSKUSelect(product.id, skuItem.SKU)}
                  className="cursor-pointer hover:bg-[#2A2A2A] transition-colors duration-150"
                >
                  {skuItem.SKU}
                </DropdownMenuItem>
              ))}
              {availableSKUsFromAnalysis.length === 0 && (
                <DropdownMenuItem disabled className="opacity-50">
                  Aucun SKU disponible
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
        <TableCell className="text-right font-medium pr-4 py-3">
          {rowTotal > 0 ? (
            <span className="text-green-500 font-semibold tabular-nums">{formatTotalPrice(rowTotal)}</span>
          ) : (
            <span className="text-gray-500">—</span>
          )}
        </TableCell>
      </TableRow>

      {/* Show the list of selected SKUs */}
      {productSelectedSKUs.length > 0 && (
        <TableRow className={cn(
          "hover:bg-transparent border-none",
          isAlternate ? "bg-[#161616]" : "bg-[#131313]"
        )}>
          <TableCell colSpan={9} className="py-0 px-4">
            <SelectedSKUsList
              productId={product.id}
              skus={productSelectedSKUs}
              quantities={quantities[product.id] || {}}
              calculatedPrices={calculatedPrices[product.id] || {}}
              onQuantityChange={handleQuantityChange}
              onRemoveSKU={handleSKURemove}
              hasOnlyPrice8000={onlyHas8000}
              showQuantityInputs={showQuantityInputs}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default PriceTableRow;
