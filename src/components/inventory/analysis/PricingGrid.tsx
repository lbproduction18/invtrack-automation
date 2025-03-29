
import React, { useState } from 'react';
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

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading } = useProductPrices();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('all');
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string>>({});
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number>>({});

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

    // Find the product price for calculation
    const product = productPrices.find(p => p.id === productId);
    if (product && product.price_1000) {
      const totalPrice = 1000 * product.price_1000;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
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
              <TableHead className="text-center">Total (1000 unités)</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-gray-500">
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
                  <TableCell className="text-center font-medium">
                    {calculatedPrices[product.id] ? 
                      formatTotalPrice(calculatedPrices[product.id]) : 
                      <span className="text-gray-500">–</span>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default PricingGrid;
