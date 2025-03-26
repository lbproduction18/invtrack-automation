
import React, { useState } from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import BudgetSettingsPanel from './BudgetSettingsPanel';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const { productPrices, isLoading, refetch } = useProductPrices();
  const { toast } = useToast();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, QuantityOption>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];

  // Handle quantity change for a product
  const handleQuantityChange = (productName: string, quantity: QuantityOption) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productName]: quantity
    }));
  };
  
  // Calculate total price for a product based on selected quantity
  const getProductPrice = (product: any, quantity: QuantityOption) => {
    if (!product) return 0;
    
    const priceField = `price_${quantity}` as keyof typeof product;
    return product[priceField] as number || 0;
  };
  
  // Calculate total price for a product
  const calculateProductTotal = (productName: string, selectedQty: QuantityOption | undefined) => {
    if (!selectedQty) return 0;
    
    const product = productPrices.find(p => p.product_name === productName);
    if (!product) return 0;
    
    const price = getProductPrice(product, selectedQty);
    return price || 0;
  };
  
  // Calculate the total order amount
  const calculateTotal = () => {
    let total = 0;
    
    Object.entries(selectedQuantities).forEach(([productName, quantity]) => {
      const productTotal = calculateProductTotal(productName, quantity);
      total += productTotal;
    });
    
    setSimulationTotal(total);
    return total;
  };
  
  // Calculate what the total would be if all products used the same quantity
  const calculateTrancheTotals = () => {
    const trancheTotals: Record<QuantityOption, number> = {
      1000: 0,
      2000: 0,
      3000: 0,
      4000: 0,
      5000: 0,
      8000: 0
    };
    
    quantityOptions.forEach(qty => {
      let trancheTotal = 0;
      
      productPrices.forEach(product => {
        const priceField = `price_${qty}` as keyof typeof product;
        const price = product[priceField] as number || 0;
        trancheTotal += price > 0 ? price : 0;
      });
      
      trancheTotals[qty] = trancheTotal;
    });
    
    return trancheTotals;
  };
  
  // Refresh prices from Supabase
  const handleRefreshPrices = async () => {
    try {
      await refetch();
      toast({
        title: "Prix actualisés",
        description: "Les prix ont été rechargés depuis la base de données.",
      });
      // Recalculate total after refresh
      calculateTotal();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les prix. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate tranche totals
  const trancheTotals = calculateTrancheTotals();
  
  return (
    <div className="space-y-6">
      {/* Budget Settings Panel */}
      <div className="mb-6">
        <BudgetSettingsPanel
          totalOrderAmount={simulationTotal}
          onCreateOrder={onCreateOrder}
        />
      </div>
      
      {/* Refresh Prices Button */}
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefreshPrices}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser les prix
        </Button>
      </div>
      
      {/* Simulation Table */}
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#161616] sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs text-left text-gray-400 w-1/4">Produit</TableHead>
              {quantityOptions.map(qty => (
                <TableHead key={qty} className="text-xs text-center text-gray-400 w-1/12">
                  Prix {qty}
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
                  {trancheTotals[qty] > 0 ? `${trancheTotals[qty].toLocaleString()} $ CAD` : '-'}
                </TableCell>
              ))}
              <TableCell></TableCell>
              <TableCell className="text-right font-medium text-white">
                {simulationTotal > 0 ? `${simulationTotal.toLocaleString()} $ CAD` : '-'}
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                  Chargement des prix...
                </TableCell>
              </TableRow>
            ) : productPrices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                  Aucun produit trouvé dans la base de données
                </TableCell>
              </TableRow>
            ) : (
              productPrices.map(product => {
                const productName = product.product_name;
                const selectedQty = selectedQuantities[productName];
                const totalPrice = selectedQty ? calculateProductTotal(productName, selectedQty) : 0;
                
                return (
                  <TableRow key={product.id} className="hover:bg-[#161616]">
                    <TableCell className="font-medium">{productName}</TableCell>
                    
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
                            handleQuantityChange(productName, parseInt(value) as QuantityOption);
                            // Recalculate total after selection
                            setTimeout(() => calculateTotal(), 0);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#161616] border-[#272727]">
                          {quantityOptions.map(qty => (
                            <SelectItem key={qty} value={qty.toString()}>
                              {qty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    
                    {/* Total price */}
                    <TableCell className="text-right">
                      {totalPrice > 0 ? 
                        <span className="font-medium">{totalPrice.toLocaleString()} $ CAD</span> :
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

export default BudgetSimulation;
