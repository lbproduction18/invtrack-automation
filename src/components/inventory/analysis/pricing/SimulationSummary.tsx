import React from 'react';
import { AnalysisItem } from '@/types/analysisItem';
import { Product } from '@/types/product';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { formatTotalPrice, formatPrice } from './PriceFormatter';
import { Loader2 } from 'lucide-react';
import SimulationTotal from './components/SimulationTotal';

interface SimulationSummaryProps {
  analysisItems: AnalysisItem[];
  products: Product[];
  simulationTotal: number;
  selectedSKUs: Record<string, string[]>;
  quantities: Record<string, Record<string, string>>;
  calculatedPrices: Record<string, Record<string, number | string>>;
  productPrices: any[];
  getUnitPriceForSKU: (productId: string, sku: string, quantity?: string) => number;
}

const SimulationSummary: React.FC<SimulationSummaryProps> = ({
  analysisItems,
  products,
  simulationTotal,
  selectedSKUs,
  quantities,
  calculatedPrices,
  productPrices,
  getUnitPriceForSKU
}) => {
  // Find the corresponding product for each analysis item
  const getProductDetails = (analysisItem: AnalysisItem) => {
    const product = products.find(p => p.id === analysisItem.product_id);
    return {
      sku: analysisItem.sku_code || product?.SKU || '-',
      name: product?.product_name || '-',
      quantity: analysisItem.quantity_selected || 0,
      unitPrice: calculateUnitPrice(analysisItem, product),
      totalPrice: calculateTotalPrice(analysisItem, product)
    };
  };

  // Calculate unit price based on selected quantity
  const calculateUnitPrice = (analysisItem: AnalysisItem, product?: Product) => {
    if (!analysisItem.quantity_selected) return 0;
    
    const quantity = analysisItem.quantity_selected;
    const priceField = `price_${quantity}` as keyof typeof analysisItem;
    
    // Try to get price from analysis item first
    if (analysisItem[priceField] && typeof analysisItem[priceField] === 'number') {
      return analysisItem[priceField] as number;
    }
    
    // Fall back to product prices if needed
    if (product) {
      const productPriceField = `price_${quantity}` as keyof typeof product;
      if (product[productPriceField] && typeof product[productPriceField] === 'number') {
        return product[productPriceField] as number;
      }
    }
    
    return 0;
  };

  // Calculate total price (quantity × unit price)
  const calculateTotalPrice = (analysisItem: AnalysisItem, product?: Product) => {
    const unitPrice = calculateUnitPrice(analysisItem, product);
    const quantity = analysisItem.quantity_selected || 0;
    return unitPrice * quantity;
  };

  // Extract details from the selectedSKUs and related data
  const getSelectedSKUDetails = () => {
    const details: Array<{
      sku: string;
      productName: string | null;
      quantity: string;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    // Go through each product and its selected SKUs
    Object.entries(selectedSKUs).forEach(([productId, skus]) => {
      const product = productPrices.find(p => p.id === productId);
      
      skus.forEach(sku => {
        const quantity = quantities[productId]?.[sku] || '0';
        
        // Skip invalid entries (quantity must be a valid number > 0)
        if (quantity && parseInt(quantity) > 0) {
          const unitPrice = getUnitPriceForSKU(productId, sku, quantity);
          const totalPrice = typeof calculatedPrices[productId]?.[sku] === 'number' 
            ? calculatedPrices[productId][sku] as number 
            : 0;
          
          details.push({
            sku,
            productName: product?.product_name || null,
            quantity,
            unitPrice,
            totalPrice
          });
        }
      });
    });
    
    return details;
  };

  // Filter analysis items that have sku_code and quantity_selected
  const validAnalysisItems = analysisItems.filter(item => 
    item.sku_code && item.quantity_selected && item.quantity_selected > 0
  );

  // Get selected SKU details from the current selection
  const selectedSKUDetails = getSelectedSKUDetails();
  
  // Determine if we have any items to display (either from analysis or current selection)
  const hasItemsToDisplay = selectedSKUDetails.length > 0;
  const isLoading = false; // We could add loading state later if needed

  return (
    <div className="mt-4 rounded-md border border-[#272727] overflow-hidden">
      <div className="p-4 bg-[#161616] border-b border-[#272727]">
        <h3 className="text-sm font-medium">Récapitulatif détaillé</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Chargement des données...</span>
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-[#161616] sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-left">SKU</TableHead>
              <TableHead className="text-left">Produit</TableHead>
              <TableHead className="text-center">Quantité</TableHead>
              <TableHead className="text-center">Prix unitaire</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {!hasItemsToDisplay ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  Aucun produit sélectionné dans la simulation
                </TableCell>
              </TableRow>
            ) : (
              selectedSKUDetails.map(item => (
                <TableRow key={item.sku} className="hover:bg-[#1a1a1a]">
                  <TableCell className="py-1">{item.sku}</TableCell>
                  <TableCell className="py-1">{item.productName || '-'}</TableCell>
                  <TableCell className="py-1 text-center">{item.quantity}</TableCell>
                  <TableCell className="py-1 text-center">{formatPrice(item.unitPrice)}</TableCell>
                  <TableCell className="py-1 text-right">{formatTotalPrice(item.totalPrice)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          
          {/* Only show the footer if we have items or a non-zero total */}
          {(hasItemsToDisplay || simulationTotal > 0) && (
            <TableFooter className="bg-[#161616] border-t border-[#272727]">
              <SimulationTotal simulationTotal={simulationTotal} />
            </TableFooter>
          )}
        </Table>
      )}
    </div>
  );
};

export default SimulationSummary;
