
import React, { useEffect, useState } from 'react';
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

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading } = useProductPrices();
  const [columnTotals, setColumnTotals] = useState<Record<string, number>>({
    price_1000: 0,
    price_2000: 0,
    price_3000: 0,
    price_4000: 0,
    price_5000: 0,
    price_8000: 0
  });

  // Calculate column totals when product prices change
  useEffect(() => {
    if (productPrices.length > 0) {
      const totals = {
        price_1000: 0,
        price_2000: 0,
        price_3000: 0,
        price_4000: 0,
        price_5000: 0,
        price_8000: 0
      };

      productPrices.forEach(product => {
        Object.keys(totals).forEach(key => {
          const value = product[key as keyof typeof product] as number | null;
          if (value) {
            totals[key as keyof typeof totals] += value;
          }
        });
      });

      setColumnTotals(totals);
    }
  }, [productPrices]);

  const renderPriceCell = (price: number | null) => {
    if (price === null || price === 0) {
      return <span className="text-gray-500">-</span>;
    }
    return `${price.toLocaleString()} $`;
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
      <Table>
        <TableHeader className="bg-[#161616] sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-left">Produit</TableHead>
            <TableHead className="text-center">Prix 1000</TableHead>
            <TableHead className="text-center">Prix 2000</TableHead>
            <TableHead className="text-center">Prix 3000</TableHead>
            <TableHead className="text-center">Prix 4000</TableHead>
            <TableHead className="text-center">Prix 5000</TableHead>
            <TableHead className="text-center">Prix 8000</TableHead>
          </TableRow>
          
          {/* Totals row */}
          <TableRow className="hover:bg-[#1A1A1A] bg-[#1A1A1A] border-t border-[#272727]">
            <TableCell className="font-medium text-gray-400">Total par tranche</TableCell>
            <TableCell className="text-center font-medium">
              {columnTotals.price_1000 > 0 ? `${columnTotals.price_1000.toLocaleString()} $` : '-'}
            </TableCell>
            <TableCell className="text-center font-medium">
              {columnTotals.price_2000 > 0 ? `${columnTotals.price_2000.toLocaleString()} $` : '-'}
            </TableCell>
            <TableCell className="text-center font-medium">
              {columnTotals.price_3000 > 0 ? `${columnTotals.price_3000.toLocaleString()} $` : '-'}
            </TableCell>
            <TableCell className="text-center font-medium">
              {columnTotals.price_4000 > 0 ? `${columnTotals.price_4000.toLocaleString()} $` : '-'}
            </TableCell>
            <TableCell className="text-center font-medium">
              {columnTotals.price_5000 > 0 ? `${columnTotals.price_5000.toLocaleString()} $` : '-'}
            </TableCell>
            <TableCell className="text-center font-medium">
              {columnTotals.price_8000 > 0 ? `${columnTotals.price_8000.toLocaleString()} $` : '-'}
            </TableCell>
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
              <TableRow key={product.id} className="hover:bg-[#161616]">
                <TableCell className="font-medium">{product.product_name}</TableCell>
                <TableCell className="text-center">{renderPriceCell(product.price_1000)}</TableCell>
                <TableCell className="text-center">{renderPriceCell(product.price_2000)}</TableCell>
                <TableCell className="text-center">{renderPriceCell(product.price_3000)}</TableCell>
                <TableCell className="text-center">{renderPriceCell(product.price_4000)}</TableCell>
                <TableCell className="text-center">{renderPriceCell(product.price_5000)}</TableCell>
                <TableCell className="text-center">{renderPriceCell(product.price_8000)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PricingGrid;
