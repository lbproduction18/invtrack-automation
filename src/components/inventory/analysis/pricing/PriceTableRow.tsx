
import React, { useMemo } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductPrice } from '@/hooks/useProductPrices';
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import SelectedSKUsList from './SelectedSKUsList';
import { formatTotalPrice } from './PriceFormatter';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

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
  formatTotalPrice
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
  
  // Filter SKUs from analysisItems that match the current product category
  const availableSKUsFromAnalysis = useMemo(() => {
    // Get product name/category in lowercase for comparison
    const productCategory = product.product_name.toLowerCase().trim();
    
    // Get all SKUs from analysis_items that aren't already selected
    return analysisItems
      .filter(item => item.sku_code && !allSelectedSKUs.includes(item.sku_code))
      .map(item => ({
        id: item.product_id || '',
        SKU: item.sku_code || '',
        productName: item.sku_label
      }))
      .filter(skuItem => {
        // Skip empty SKUs
        if (!skuItem.SKU) return false;
        
        // Extract category from SKU (e.g. "COLLAGENE" from "COLLAGENE-LOTUS")
        const skuCategory = skuItem.SKU.split('-')[0].toLowerCase();
        
        // Match if the SKU category includes the product name or vice versa
        return skuCategory.includes(productCategory) || 
               productCategory.includes(skuCategory);
      })
      .sort((a, b) => a.SKU.localeCompare(b.SKU)); // Sort alphabetically
  }, [analysisItems, allSelectedSKUs, product.product_name]);

  // Get the total price for all SKUs in this product row
  const rowTotal = getTotalForProduct(product.id);

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
          {availableSKUsFromAnalysis.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full px-3 py-1 text-sm border border-input rounded-md bg-[#161616] hover:bg-[#272727]">
                Ajouter SKU
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[200px] overflow-y-auto bg-[#161616] border-[#272727] z-[100]">
                {availableSKUsFromAnalysis.map((skuItem) => (
                  <DropdownMenuItem 
                    key={skuItem.SKU}
                    onClick={() => handleSKUSelect(product.id, skuItem.SKU)}
                    className="cursor-pointer hover:bg-[#272727]"
                  >
                    {skuItem.SKU}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-gray-500 text-sm">Aucun SKU disponible</span>
          )}
        </TableCell>
        <TableCell className="text-center">
          {/* This cell is left empty as quantities are now handled for each SKU */}
        </TableCell>
        <TableCell className="text-right font-medium pr-4">
          {rowTotal > 0 ? formatTotalPrice(rowTotal) : <span className="text-gray-500">–</span>}
        </TableCell>
      </TableRow>

      {/* Show the list of selected SKUs */}
      {productSelectedSKUs.length > 0 && (
        <TableRow className="hover:bg-transparent border-none">
          <TableCell colSpan={9} className="py-0 px-4">
            <SelectedSKUsList
              productId={product.id}
              skus={productSelectedSKUs}
              quantities={quantities[product.id] || {}}
              calculatedPrices={calculatedPrices[product.id] || {}}
              onQuantityChange={handleQuantityChange}
              onRemoveSKU={handleSKURemove}
              hasOnlyPrice8000={onlyHas8000}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default PriceTableRow;
