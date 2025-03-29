import React, { useEffect, useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProductPrices } from '@/hooks/useProductPrices';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OrderSimulationTableProps {
  selectedQuantities: Record<string, QuantityOption>;
  onQuantityChange: (productId: string, quantity: QuantityOption) => void;
  onSimulationTotalChange: (total: number) => void;
}

const OrderSimulationTable: React.FC<OrderSimulationTableProps> = ({
  selectedQuantities,
  onQuantityChange,
  onSimulationTotalChange
}) => {
  const { products } = useProducts('analysis');
  const { analysisItems } = useAnalysisItems();
  const { productPrices } = useProductPrices();
  const [simulationTotal, setSimulationTotal] = useState(0);
  const [trancheTotals, setTrancheTotals] = useState<Record<QuantityOption, number>>({
    1000: 0,
    2000: 0,
    3000: 0,
    4000: 0,
    5000: 0,
    8000: 0
  });
  
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];
  
  // Filter products that are in analysis
  const analysisProducts = products.filter(product => {
    return analysisItems.some(item => item.product_id === product.id);
  });
  
  // Calculate total price for a product based on quantity
  const getProductPrice = (productId: string, quantity: QuantityOption) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    
    const priceField = `price_${quantity}` as keyof typeof product;
    return product[priceField] as number || 0;
  };
  
  // Calculate total order amount
  const calculateTotal = () => {
    let total = 0;
    
    Object.entries(selectedQuantities).forEach(([productId, quantity]) => {
      const price = getProductPrice(productId, quantity);
      total += price > 0 ? price : 0;
    });
    
    return total;
  };
  
  // Calculate what the total would be if all products used the same quantity
  const calculateTrancheTotals = () => {
    const newTrancheTotals: Record<QuantityOption, number> = {
      1000: 0,
      2000: 0,
      3000: 0,
      4000: 0,
      5000: 0,
      8000: 0
    };
    
    quantityOptions.forEach(qty => {
      let trancheTotal = 0;
      
      analysisProducts.forEach(product => {
        const priceField = `price_${qty}` as keyof typeof product;
        const price = product[priceField] as number || 0;
        trancheTotal += price > 0 ? price : 0;
      });
      
      newTrancheTotals[qty] = trancheTotal;
    });
    
    setTrancheTotals(newTrancheTotals);
  };
  
  // Update total when selections change
  useEffect(() => {
    const total = calculateTotal();
    setSimulationTotal(total);
    onSimulationTotalChange(total);
    calculateTrancheTotals();
  }, [selectedQuantities, products, analysisItems]);
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#161616]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs text-left text-gray-400 w-1/4">Produit</TableHead>
              {quantityOptions.map(qty => (
                <TableHead key={qty} className="text-xs text-center text-gray-400 w-1/12">
                  Prix {qty.toLocaleString()}
                </TableHead>
              ))}
              <TableHead className="text-xs text-center text-gray-400 w-1/6">Quantité</TableHead>
              <TableHead className="text-xs text-right text-gray-400 w-1/6">Total</TableHead>
            </TableRow>
            {/* Tranche totals row */}
            <TableRow className="hover:bg-[#1A1A1A] bg-[#1A1A1A] border-t border-[#272727]">
              <TableCell className="font-medium text-gray-400">Total par tranche</TableCell>
              {quantityOptions.map(qty => (
                <TableCell key={qty} className="text-center font-medium text-gray-300">
                  {trancheTotals[qty] > 0 ? `${trancheTotals[qty].toLocaleString()} $` : '-'}
                </TableCell>
              ))}
              <TableCell></TableCell>
              <TableCell className="text-right font-medium text-white">
                {simulationTotal > 0 ? `${simulationTotal.toLocaleString()} $` : '-'}
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analysisProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                  Aucun produit en analyse
                </TableCell>
              </TableRow>
            ) : (
              analysisProducts.map(product => {
                const selectedQty = selectedQuantities[product.id];
                const totalPrice = selectedQty ? getProductPrice(product.id, selectedQty) : 0;
                
                return (
                  <TableRow key={product.id} className="hover:bg-[#161616]">
                    <TableCell className="font-medium">{product.SKU}</TableCell>
                    
                    {/* Price cells for each quantity option */}
                    {quantityOptions.map(qty => {
                      const priceField = `price_${qty}` as keyof typeof product;
                      const price = product[priceField] as number;
                      
                      return (
                        <TableCell key={qty} className="text-center">
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
                        </TableCell>
                      );
                    })}
                    
                    {/* Quantity selector */}
                    <TableCell>
                      <Select
                        value={selectedQty?.toString() || ""}
                        onValueChange={(value) => {
                          if (value) {
                            onQuantityChange(product.id, parseInt(value) as QuantityOption);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-[#121212] border-[#272727] z-[1]">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
                          {quantityOptions.map(qty => (
                            <SelectItem key={qty} value={qty.toString()}>
                              {qty.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    
                    {/* Total price */}
                    <TableCell className="text-right">
                      {totalPrice > 0 ? 
                        <span className="font-medium">{totalPrice.toLocaleString()} $</span> :
                        <span className="text-gray-500">-</span>
                      }
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderSimulationTable;
