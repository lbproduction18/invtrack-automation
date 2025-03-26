
import React, { useState, useEffect } from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, PlusCircle, X } from 'lucide-react';
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
import { type SelectedSKU } from '@/types/product';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const { productPrices, isLoading, refetch } = useProductPrices();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('analysis');
  const { toast } = useToast();
  
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, SelectedSKU[]>>({});
  
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];

  // Group analysis products by parent product for the dropdown
  const groupedAnalysisProducts = React.useMemo(() => {
    const groupedProducts: Record<string, Array<{ id: string, SKU: string, productName: string | null }>> = {};
    
    products.forEach(product => {
      // Check if the product is in analysis
      if (analysisItems.some(item => item.product_id === product.id)) {
        const productName = product.product_name || '';
        // Extract the base product name (before any dash/hyphen)
        const baseProductName = productName.split('–')[0]?.trim() || productName;
        
        if (!groupedProducts[baseProductName]) {
          groupedProducts[baseProductName] = [];
        }
        
        groupedProducts[baseProductName].push({
          id: product.id,
          SKU: product.SKU,
          productName: product.product_name
        });
      }
    });
    
    return groupedProducts;
  }, [products, analysisItems]);
  
  // Add a SKU to a product row
  const handleAddSKU = (productName: string, skuInfo: { id: string, SKU: string, productName: string | null }) => {
    setSelectedSKUs(prev => {
      const currentSKUs = prev[productName] || [];
      
      // Check if this SKU is already added
      const isAlreadyAdded = currentSKUs.some(sku => sku.SKU === skuInfo.SKU);
      if (isAlreadyAdded) {
        toast({
          title: "SKU déjà ajouté",
          description: `${skuInfo.SKU} est déjà dans la liste.`,
          variant: "destructive"
        });
        return prev;
      }
      
      return {
        ...prev,
        [productName]: [
          ...currentSKUs,
          {
            productId: skuInfo.id,
            SKU: skuInfo.SKU,
            productName: skuInfo.productName,
            quantity: 0,
            price: 0
          }
        ]
      };
    });
  };
  
  // Remove a SKU from a product row
  const handleRemoveSKU = (productName: string, skuIndex: number) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      updatedSKUs.splice(skuIndex, 1);
      
      const updatedSelection = {
        ...prev,
        [productName]: updatedSKUs
      };
      
      // If no SKUs left for this product, remove the key
      if (updatedSKUs.length === 0) {
        delete updatedSelection[productName];
      }
      
      return updatedSelection;
    });
  };
  
  // Handle quantity change for a SKU
  const handleQuantityChange = (productName: string, skuIndex: number, quantity: QuantityOption) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      if (updatedSKUs[skuIndex]) {
        // Find the price for this product and quantity
        const productPrice = productPrices.find(p => p.product_name === productName);
        const priceField = `price_${quantity}` as keyof typeof productPrice;
        const price = productPrice ? (productPrice[priceField] as number || 0) : 0;
        
        updatedSKUs[skuIndex] = {
          ...updatedSKUs[skuIndex],
          quantity,
          price
        };
      }
      
      return {
        ...prev,
        [productName]: updatedSKUs
      };
    });
  };
  
  // Calculate total price for a specific SKU
  const calculateSKUTotal = (sku: SelectedSKU): number => {
    return sku.quantity * sku.price;
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
      calculateOrderTotal();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les prix. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate the total order amount
  const calculateOrderTotal = () => {
    let total = 0;
    
    Object.values(selectedSKUs).forEach(skuArray => {
      skuArray.forEach(sku => {
        total += calculateSKUTotal(sku);
      });
    });
    
    setSimulationTotal(total);
    return total;
  };
  
  // Update the total whenever selections change
  useEffect(() => {
    calculateOrderTotal();
  }, [selectedSKUs]);
  
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
              <TableHead className="text-xs text-left text-gray-400 w-1/5">Produit</TableHead>
              {quantityOptions.map(qty => (
                <TableHead key={qty} className="text-xs text-center text-gray-400 w-1/12">
                  Prix {qty}
                </TableHead>
              ))}
              <TableHead className="text-xs text-center text-gray-400 w-1/6">Saveur (SKU)</TableHead>
              <TableHead className="text-xs text-right text-gray-400 w-1/12"></TableHead>
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
                const hasSKUs = selectedSKUs[productName] && selectedSKUs[productName].length > 0;
                const availableSKUs = groupedAnalysisProducts[productName] || [];
                
                return (
                  <React.Fragment key={product.id}>
                    {/* Main product row */}
                    <TableRow className="hover:bg-[#161616]">
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
                      
                      {/* SKU Selection dropdown */}
                      <TableCell>
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
                                  onClick={() => handleAddSKU(productName, sku)}
                                >
                                  {sku.SKU}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-gray-500 text-sm">Aucun SKU disponible</span>
                        )}
                      </TableCell>
                      
                      {/* Total for this product row (empty in main row) */}
                      <TableCell className="text-right">
                      </TableCell>
                    </TableRow>
                    
                    {/* SKU rows if any are selected */}
                    {hasSKUs && selectedSKUs[productName].map((sku, index) => (
                      <TableRow key={`${sku.SKU}-${index}`} className="bg-[#141414] hover:bg-[#181818]">
                        <TableCell className="pl-8 text-gray-400 text-sm">
                          {sku.SKU}
                        </TableCell>
                        
                        {/* Empty cells for price columns */}
                        {quantityOptions.map(qty => (
                          <TableCell key={qty}></TableCell>
                        ))}
                        
                        {/* Quantity selection for this SKU */}
                        <TableCell>
                          <Select
                            value={sku.quantity ? sku.quantity.toString() : ""}
                            onValueChange={(value) => {
                              if (value) {
                                handleQuantityChange(productName, index, parseInt(value) as QuantityOption);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                              <SelectValue placeholder="Quantité" />
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
                        
                        {/* Total price and remove button */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-medium">
                              {calculateSKUTotal(sku) > 0 ? 
                                `${calculateSKUTotal(sku).toLocaleString()} $ CAD` : 
                                '-'
                              }
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSKU(productName, index)}
                              className="h-6 w-6"
                            >
                              <X className="h-4 w-4 text-gray-400 hover:text-white" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
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
