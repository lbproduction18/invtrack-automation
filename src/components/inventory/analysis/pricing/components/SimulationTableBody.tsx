
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { AnalysisItem } from '@/types/analysisItem';
import { Product } from '@/types/product';
import { formatTotalPrice } from '../PriceFormatter';

interface SimulationTableBodyProps {
  refreshedAnalysisItems: AnalysisItem[];
  products: Product[];
}

const SimulationTableBody: React.FC<SimulationTableBodyProps> = ({ 
  refreshedAnalysisItems, 
  products 
}) => {
  // Helper function to find corresponding analysis item for a product
  const findAnalysisItem = (productId: string): AnalysisItem | undefined => {
    return refreshedAnalysisItems.find(item => item.product_id === productId);
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

  // Get SKU information to display
  const getDisplaySKU = (productId: string): string => {
    const analysisItem = findAnalysisItem(productId);
    if (analysisItem?.sku_code) {
      return analysisItem.sku_code;
    }
    
    // Fallback to product SKU if no specific SKU is set in analysis_item
    const product = products.find(p => p.id === productId);
    return product ? product.SKU : '–';
  };

  if (refreshedAnalysisItems.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={3} className="h-24 text-center text-gray-500">
          Aucun produit trouvé dans la base de données
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {products
        .filter(product => {
          // Filter products that have corresponding analysis items
          return refreshedAnalysisItems.some(item => item.product_id === product.id);
        })
        .map(product => {
          const quantity = getQuantityFromDatabase(product.id);
          const price = calculatePrice(product.id);
          const displaySKU = getDisplaySKU(product.id);
          
          return (
            <TableRow key={product.id} className="hover:bg-[#161616] border-t border-[#272727]">
              <TableCell className="font-medium">{displaySKU}</TableCell>
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
        })}
    </>
  );
};

export default SimulationTableBody;
