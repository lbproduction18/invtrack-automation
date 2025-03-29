
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
}

const SimulationSummary: React.FC<SimulationSummaryProps> = ({
  analysisItems,
  products,
  simulationTotal
}) => {
  // Helper function to find corresponding analysis item for a product
  const findAnalysisItem = (productId: string): AnalysisItem | undefined => {
    return analysisItems.find(item => item.product_id === productId);
  };

  // Get the quantity for a specific SKU/product from the analysis_items table
  const getQuantityFromDatabase = (productId: string): string => {
    const analysisItem = findAnalysisItem(productId);
    return analysisItem && analysisItem.quantity_selected 
      ? analysisItem.quantity_selected.toString() 
      : '';
  };

  // Calculate price based on quantity if available
  const calculatePrice = (productId: string): number | string => {
    const analysisItem = findAnalysisItem(productId);
    if (!analysisItem || !analysisItem.quantity_selected) {
      return '–';
    }
    
    // Simple price calculation (would need proper calculation logic based on your pricing tiers)
    // This is a placeholder - the actual calculation would depend on your price structure
    const quantity = analysisItem.quantity_selected;
    
    // Find the product to get its price - assuming you have price info in the product data
    const product = products.find(p => p.id === productId);
    if (!product) return '–';
    
    // Use the relevant price tier based on quantity
    let price = 0;
    if (quantity <= 1000 && product.price_1000) {
      price = product.price_1000 * quantity;
    } else if (quantity <= 2000 && product.price_2000) {
      price = product.price_2000 * quantity;
    } else if (quantity <= 3000 && product.price_3000) {
      price = product.price_3000 * quantity;
    } else if (quantity <= 4000 && product.price_4000) {
      price = product.price_4000 * quantity;
    } else if (quantity <= 5000 && product.price_5000) {
      price = product.price_5000 * quantity;
    } else {
      // Use price_1000 as fallback if no appropriate tier is found
      price = (product.price_1000 || 0) * quantity;
    }
    
    return price;
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
                  const quantity = getQuantityFromDatabase(product.id);
                  const price = calculatePrice(product.id);
                  
                  return (
                    <TableRow key={product.id} className="hover:bg-[#161616] border-t border-[#272727]">
                      <TableCell className="font-medium">{product.SKU}</TableCell>
                      <TableCell className="text-center">
                        {quantity ? quantity : <span className="text-gray-500">–</span>}
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
