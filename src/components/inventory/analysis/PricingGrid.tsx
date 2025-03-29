
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useProductPrices } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading } = useProductPrices();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('all');
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number | string>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  // List of standard quantities that match price columns
  const standardQuantities = [1000, 2000, 3000, 4000, 5000, 8000];

  // Calculate the total simulation amount whenever calculatedPrices change
  useEffect(() => {
    let total = 0;
    
    // Sum up all the numeric values in calculatedPrices
    Object.values(calculatedPrices).forEach(price => {
      if (typeof price === 'number') {
        total += price;
      }
    });
    
    setSimulationTotal(total);
  }, [calculatedPrices]);

  const formatPrice = (price: number | null): React.ReactNode => {
    if (price === null || price === 0) {
      return <span className="text-gray-500">–</span>;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatTotalPrice = (price: number): string => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleSKUSelect = (productId: string, sku: string) => {
    setSelectedSKUs(prev => ({
      ...prev,
      [productId]: sku
    }));
    
    // Recalculate price if quantity already exists
    if (quantities[productId]) {
      calculateTotalPrice(productId, quantities[productId]);
    }
  };

  const handleQuantityChange = (productId: string, quantityValue: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantityValue
    }));
    
    calculateTotalPrice(productId, quantityValue);
  };

  const calculateTotalPrice = (productId: string, quantityValue: string) => {
    const quantity = parseInt(quantityValue, 10);
    const product = productPrices.find(p => p.id === productId);
    
    if (!product || isNaN(quantity) || quantity <= 0) {
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: ""
      }));
      return;
    }
    
    // Check if the quantity matches one of our standard price brackets
    if (quantity === 1000 && product.price_1000) {
      const totalPrice = quantity * product.price_1000;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
      }));
    } else if (quantity === 2000 && product.price_2000) {
      const totalPrice = quantity * product.price_2000;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
      }));
    } else if (quantity === 3000 && product.price_3000) {
      const totalPrice = quantity * product.price_3000;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
      }));
    } else if (quantity === 4000 && product.price_4000) {
      const totalPrice = quantity * product.price_4000;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
      }));
    } else if (quantity === 5000 && product.price_5000) {
      const totalPrice = quantity * product.price_5000;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
      }));
    } else if (quantity === 8000 && product.price_8000) {
      const totalPrice = quantity * product.price_8000;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
      }));
    } else {
      // If quantity does not match any standard price bracket
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: "Sélectionne une quantité standard (1000, 2000, 3000, etc.)"
      }));
    }
  };

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

  // Get all product SKUs
  const productSKUs = products.map(product => ({
    id: product.id,
    SKU: product.SKU
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="bg-[#161616] sticky top-0 z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-left w-[20%]">Produit</TableHead>
                <TableHead className="text-center">Prix 1000</TableHead>
                <TableHead className="text-center">Prix 2000</TableHead>
                <TableHead className="text-center">Prix 3000</TableHead>
                <TableHead className="text-center">Prix 4000</TableHead>
                <TableHead className="text-center">Prix 5000</TableHead>
                <TableHead className="text-center">Prix 8000</TableHead>
                <TableHead className="text-center">SKU</TableHead>
                <TableHead className="text-center">Quantité</TableHead>
                <TableHead className="text-center">Total (CAD)</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {sortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center text-gray-500">
                    Aucun produit trouvé dans la base de données
                  </TableCell>
                </TableRow>
              ) : (
                sortedProducts.map(product => (
                  <TableRow key={product.id} className="hover:bg-[#161616] border-t border-[#272727]">
                    <TableCell className="font-medium">{product.product_name}</TableCell>
                    <TableCell className="text-center">{formatPrice(product.price_1000)}</TableCell>
                    <TableCell className="text-center">{formatPrice(product.price_2000)}</TableCell>
                    <TableCell className="text-center">{formatPrice(product.price_3000)}</TableCell>
                    <TableCell className="text-center">{formatPrice(product.price_4000)}</TableCell>
                    <TableCell className="text-center">{formatPrice(product.price_5000)}</TableCell>
                    <TableCell className="text-center">{formatPrice(product.price_8000)}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full px-3 py-1 text-sm border border-input rounded-md bg-[#161616] hover:bg-[#272727]">
                          {selectedSKUs[product.id] || "Sélectionner SKU"}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-[200px] overflow-y-auto bg-[#161616] border-[#272727]">
                          {productSKUs.map((skuItem) => (
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
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        placeholder="Quantité"
                        value={quantities[product.id] || ''}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-24 h-8 mx-auto bg-[#161616] border-[#272727] text-center"
                        min="1"
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {typeof calculatedPrices[product.id] === 'number' ? 
                        formatTotalPrice(calculatedPrices[product.id] as number) : 
                        calculatedPrices[product.id] ? 
                          <span className="text-yellow-500 text-xs">{calculatedPrices[product.id]}</span> : 
                          <span className="text-gray-500">–</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      {/* Persistent Summary Section */}
      <div className="mt-4 p-4 rounded-md border border-[#272727] bg-[#161616] flex justify-between items-center">
        <h3 className="text-lg font-medium">Total de la simulation</h3>
        <div className="text-xl font-bold text-primary">
          {formatTotalPrice(simulationTotal)}
        </div>
      </div>
    </div>
  );
};

export default PricingGrid;
