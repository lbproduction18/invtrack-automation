
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { ProductPrice } from '@/hooks/useProductPrices';
import { formatPrice } from './PriceFormatter';
import PriceTableRow from './PriceTableRow';
import { Loader2 } from 'lucide-react';
import { AnalysisItem } from '@/hooks/useAnalysisItems';

interface PriceTableProps {
  productPrices: ProductPrice[];
  isLoading: boolean;
  selectedSKUs: Record<string, string[]>;
  quantities: Record<string, Record<string, string>>;
  calculatedPrices: Record<string, Record<string, number | string>>;
  analysisProductSKUs: Array<{ id: string, SKU: string }>;
  handleSKUSelect: (productId: string, sku: string) => void;
  handleSKURemove: (productId: string, sku: string) => void;
  handleQuantityChange: (productId: string, sku: string, quantityValue: string) => void;
  getTotalForProduct: (productId: string) => number;
  formatTotalPrice: (price: number) => string;
  showQuantityInputs?: boolean;
  simulationTotal?: number;
  analysisMode?: 'manual' | 'ai';
  analysisItems?: AnalysisItem[];
}

const PriceTable: React.FC<PriceTableProps> = ({
  productPrices,
  isLoading,
  selectedSKUs,
  quantities,
  calculatedPrices,
  analysisProductSKUs,
  handleSKUSelect,
  handleSKURemove,
  handleQuantityChange,
  getTotalForProduct,
  formatTotalPrice,
  showQuantityInputs = true,
  simulationTotal = 0,
  analysisMode = 'manual',
  analysisItems = []
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des prix...</span>
      </div>
    );
  }

  const sortedProducts = [...productPrices].sort((a, b) => {
    const aOnlyHas8000 = 
      (!a.price_1000 || a.price_1000 === 0) && 
      (!a.price_2000 || a.price_2000 === 0) && 
      (!a.price_3000 || a.price_3000 === 0) && 
      (!a.price_4000 || a.price_4000 === 0) && 
      (!a.price_5000 || a.price_5000 === 0) && 
      (a.price_8000 && a.price_8000 > 0);
      
    const bOnlyHas8000 = 
      (!b.price_1000 || b.price_1000 === 0) && 
      (!b.price_2000 || b.price_2000 === 0) && 
      (!b.price_3000 || b.price_3000 === 0) && 
      (!b.price_4000 || b.price_4000 === 0) && 
      (!b.price_5000 || b.price_5000 === 0) && 
      (b.price_8000 && b.price_8000 > 0);
    
    if (aOnlyHas8000 && !bOnlyHas8000) return 1;
    if (!aOnlyHas8000 && bOnlyHas8000) return -1;
    return a.product_name.localeCompare(b.product_name);
  });

  return (
    <Table>
      <TableHeader className="bg-[#161616] sticky top-0 z-50">
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-left w-[20%] pl-4 bg-[#161616]">Produit</TableHead>
          <TableHead className="text-center bg-[#161616]">Prix 1000</TableHead>
          <TableHead className="text-center bg-[#161616]">Prix 2000</TableHead>
          <TableHead className="text-center bg-[#161616]">Prix 3000</TableHead>
          <TableHead className="text-center bg-[#161616]">Prix 4000</TableHead>
          <TableHead className="text-center bg-[#161616]">Prix 5000</TableHead>
          <TableHead className="text-center bg-[#161616]">Prix 8000</TableHead>
          <TableHead className="text-center bg-[#161616]">SKU</TableHead>
          {analysisMode === 'manual' && (
            <TableHead className="text-right pr-4 bg-[#161616]">Total (CAD)</TableHead>
          )}
        </TableRow>
      </TableHeader>
            
      <TableBody>
        {sortedProducts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={analysisMode === 'manual' ? 9 : 8} className="h-24 text-center text-gray-500">
              Aucun produit trouvé dans la base de données
            </TableCell>
          </TableRow>
        ) : (
          sortedProducts.map(product => (
            <PriceTableRow
              key={product.id}
              product={product}
              selectedSKUs={selectedSKUs}
              quantities={quantities}
              calculatedPrices={calculatedPrices}
              analysisProductSKUs={analysisProductSKUs}
              handleSKUSelect={handleSKUSelect}
              handleSKURemove={handleSKURemove}
              handleQuantityChange={handleQuantityChange}
              getTotalForProduct={getTotalForProduct}
              formatPrice={formatPrice}
              formatTotalPrice={formatTotalPrice}
              showQuantityInputs={showQuantityInputs}
              analysisMode={analysisMode}
            />
          ))
        )}
      </TableBody>
      
      {analysisMode === 'manual' && showQuantityInputs && simulationTotal > 0 && (
        <TableFooter className="bg-[#161616]">
          <TableRow className="border-t border-[#272727]">
            <TableCell colSpan={8} className="text-right font-semibold pr-4">
              Total Général (CAD)
            </TableCell>
            <TableCell className="text-right font-bold pr-4 text-primary">
              {formatTotalPrice(simulationTotal)}
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
      
      {/* Removed the UpdatePricesButton from the footer in AI mode */}
    </Table>
  );
};

export default PriceTable;
