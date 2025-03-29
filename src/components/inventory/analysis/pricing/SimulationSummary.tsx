
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalysisItem } from '@/hooks/useAnalysisItems';
import { formatTotalPrice } from './PriceFormatter';
import { Product } from '@/types/product';

interface SimulationSummaryProps {
  analysisItems: AnalysisItem[];
  products: Product[];
  simulationTotal: number;
  getPriceForSKU: (sku: string) => number | string;
}

const SimulationSummary: React.FC<SimulationSummaryProps> = ({
  analysisItems,
  products,
  simulationTotal,
  getPriceForSKU
}) => {
  // Find the associated analysis item for a product
  const getAnalysisItemForProduct = (productId: string): AnalysisItem | undefined => {
    return analysisItems.find(item => item.product_id === productId);
  };

  return (
    <div className="mt-4 rounded-md border border-[#272727] overflow-hidden">
      <div className="p-4 bg-[#161616]">
        <h3 className="text-lg font-medium">Résumé de la simulation</h3>
      </div>
      
      <ScrollArea className="h-[250px]">
        <Table>
          <TableHeader className="bg-[#161616] sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-left">SKU</TableHead>
              <TableHead className="text-center">Quantité choisie</TableHead>
              <TableHead className="text-right">Total (CAD)</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {analysisItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                  Aucun produit trouvé dans la base de données
                </TableCell>
              </TableRow>
            ) : (
              // Map all analysis items to show their associated product details
              products
                .filter(product => {
                  // Filter products that have corresponding analysis items
                  return analysisItems.some(item => item.product_id === product.id);
                })
                .map(product => {
                  const analysisItem = getAnalysisItemForProduct(product.id);
                  const price = getPriceForSKU(product.SKU);
                  
                  return (
                    <TableRow key={product.id} className="hover:bg-[#161616] border-t border-[#272727]">
                      <TableCell className="font-medium">{product.SKU}</TableCell>
                      <TableCell className="text-center">
                        {analysisItem?.quantity_selected ? 
                          analysisItem.quantity_selected.toLocaleString() : 
                          <span className="text-gray-500">–</span>}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {typeof price === 'number' ? 
                          formatTotalPrice(price) : 
                          <span className="text-gray-500">–</span>}
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {/* Total at the bottom of the resume section */}
      <div className="p-4 border-t border-[#272727] bg-[#161616] flex justify-between items-center">
        <h4 className="font-medium">Total de la simulation</h4>
        <div className="font-bold text-primary">
          {formatTotalPrice(simulationTotal)}
        </div>
      </div>
    </div>
  );
};

export default SimulationSummary;
