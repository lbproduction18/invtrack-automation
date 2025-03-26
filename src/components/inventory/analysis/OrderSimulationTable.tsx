
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProductPrices, type ProductPrice } from '@/hooks/useProductPrices';

// Quantity options
const quantityOptions = [1000, 2000, 3000, 4000, 5000, 8000];

interface OrderSimulationTableProps {
  selectedQuantities: Record<string, number>;
  onQuantityChange: (productKey: string, quantity: number) => void;
  onSimulationTotalChange: (total: number) => void;
}

const OrderSimulationTable: React.FC<OrderSimulationTableProps> = ({
  selectedQuantities,
  onQuantityChange,
  onSimulationTotalChange
}) => {
  const { productPrices, isLoading } = useProductPrices();
  
  // Filter out products with no price data
  const validProducts = productPrices.filter(product => 
    product.price_1000 !== null || 
    product.price_2000 !== null || 
    product.price_3000 !== null || 
    product.price_4000 !== null || 
    product.price_5000 !== null ||
    product.price_8000 !== null
  );

  // Calculate total for a product based on selected quantity
  const calculateProductTotal = (product: ProductPrice, selectedQty: number): number => {
    if (selectedQty === 0) return 0;
    
    const priceKey = `price_${selectedQty}` as keyof ProductPrice;
    const price = product[priceKey] as number | null;
    
    if (price === null) return 0;
    return price * selectedQty;
  };

  // Calculate savings percentage between highest and selected price
  const calculateSavings = (product: ProductPrice, selectedQty: number): number => {
    if (selectedQty === 0) return 0;
    
    // Find the highest price per unit
    const prices = [
      product.price_1000, 
      product.price_2000, 
      product.price_3000, 
      product.price_4000, 
      product.price_5000,
      product.price_8000
    ].filter(p => p !== null) as number[];
    
    if (prices.length === 0) return 0;
    
    const highestPricePerUnit = Math.max(...prices);
    const selectedPriceKey = `price_${selectedQty}` as keyof ProductPrice;
    const selectedPrice = product[selectedPriceKey] as number | null;
    
    if (selectedPrice === null || highestPricePerUnit === 0) return 0;
    
    return ((highestPricePerUnit - selectedPrice) / highestPricePerUnit * 100);
  };

  // Calculate the total order amount
  React.useEffect(() => {
    const total = validProducts.reduce((sum, product) => {
      const qty = selectedQuantities[product.product_name] || 0;
      return sum + calculateProductTotal(product, qty);
    }, 0);
    
    onSimulationTotalChange(total);
  }, [selectedQuantities, validProducts, onSimulationTotalChange]);

  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#272727] rounded w-full"></div>
          <div className="h-16 bg-[#272727] rounded w-full"></div>
          <div className="h-16 bg-[#272727] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
      <Table className="w-full">
        <TableHeader className="bg-[#1E1E1E]">
          <TableRow>
            <TableHead className="w-[250px] text-left pl-4">Produit</TableHead>
            <TableHead className="text-center">Prix 1000</TableHead>
            <TableHead className="text-center">Prix 2000</TableHead>
            <TableHead className="text-center">Prix 3000</TableHead>
            <TableHead className="text-center">Prix 4000</TableHead>
            <TableHead className="text-center">Prix 5000</TableHead>
            <TableHead className="text-center">Prix 8000</TableHead>
            <TableHead className="text-center">Quantité choisie</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validProducts.map((product) => {
            const selectedQty = selectedQuantities[product.product_name] || 0;
            const total = calculateProductTotal(product, selectedQty);
            const savings = calculateSavings(product, selectedQty);
            
            return (
              <TableRow key={product.id} className="border-b border-[#272727]">
                <TableCell className="pl-4 py-3 font-medium">
                  <div className="flex items-center">
                    {product.product_name}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1 max-w-xs">
                            <p className="text-xs font-semibold">Détails du produit</p>
                            <p className="text-xs">ID: {product.id}</p>
                            <p className="text-xs">Prix par unité (1000): {product.price_1000 || 'N/A'} €</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="text-center">{product.price_1000 ? `${product.price_1000} €` : '-'}</TableCell>
                <TableCell className="text-center">{product.price_2000 ? `${product.price_2000} €` : '-'}</TableCell>
                <TableCell className="text-center">{product.price_3000 ? `${product.price_3000} €` : '-'}</TableCell>
                <TableCell className="text-center">{product.price_4000 ? `${product.price_4000} €` : '-'}</TableCell>
                <TableCell className="text-center">{product.price_5000 ? `${product.price_5000} €` : '-'}</TableCell>
                <TableCell className="text-center">{product.price_8000 ? `${product.price_8000} €` : '-'}</TableCell>
                <TableCell className="text-center py-3">
                  <Select
                    value={selectedQty === 0 ? undefined : selectedQty.toString()}
                    onValueChange={(value) => onQuantityChange(product.product_name, parseInt(value, 10) || 0)}
                  >
                    <SelectTrigger className="w-24 mx-auto">
                      <SelectValue placeholder="Quantité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      {quantityOptions.map((qty) => {
                        const priceKey = `price_${qty}` as keyof ProductPrice;
                        const hasPrice = product[priceKey] !== null;
                        
                        if (!hasPrice) return null;
                        
                        return (
                          <SelectItem key={qty} value={qty.toString()}>
                            {qty}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center py-3">
                  <div>
                    <span className="font-semibold">{total.toLocaleString()} €</span>
                    {savings > 0 && (
                      <div className="text-[#3ECF8E] text-xs font-medium">
                        Économie: {savings.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderSimulationTable;
