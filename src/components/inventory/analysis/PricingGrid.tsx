
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useProductPrices } from '@/hooks/useProductPrices';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading } = useProductPrices();

  const formatPrice = (price: number | null): React.ReactNode => {
    if (price === null || price === 0) {
      return <span className="text-gray-500">–</span>;
    }
    return `$${price.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des prix...</span>
      </div>
    );
  }

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
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {productPrices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  Aucun produit trouvé dans la base de données
                </TableCell>
              </TableRow>
            ) : (
              productPrices.map(product => (
                <TableRow key={product.id} className="hover:bg-[#161616] border-t border-[#272727]">
                  <TableCell className="font-medium">{product.product_name}</TableCell>
                  <TableCell className="text-center">{formatPrice(product.price_1000)}</TableCell>
                  <TableCell className="text-center">{formatPrice(product.price_2000)}</TableCell>
                  <TableCell className="text-center">{formatPrice(product.price_3000)}</TableCell>
                  <TableCell className="text-center">{formatPrice(product.price_4000)}</TableCell>
                  <TableCell className="text-center">{formatPrice(product.price_5000)}</TableCell>
                  <TableCell className="text-center">{formatPrice(product.price_8000)}</TableCell>
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
