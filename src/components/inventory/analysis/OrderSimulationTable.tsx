
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Quantity options
const quantityOptions = [1000, 2000, 3000, 4000, 5000];

interface OrderSimulationTableProps {
  products: Product[];
  selectedQuantities: Record<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
}

const OrderSimulationTable: React.FC<OrderSimulationTableProps> = ({
  products,
  selectedQuantities,
  onQuantityChange
}) => {
  // Group products by name (without flavor)
  const groupedProducts = products.reduce((acc, product) => {
    // Extract base product name (assuming format is "ProductName - Flavor")
    const baseName = product.product_name?.split('-')[0]?.trim() || product.product_name || '';
    
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    
    acc[baseName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Get prices for a product group
  const getGroupPrices = (products: Product[]) => {
    // Calculate average price for each quantity point across all variants
    return quantityOptions.reduce((acc, qty) => {
      const priceKey = `price_${qty}` as keyof Product;
      const validProducts = products.filter(p => p[priceKey] !== null && p[priceKey] !== undefined);
      
      if (validProducts.length > 0) {
        const sum = validProducts.reduce((sum, p) => sum + (p[priceKey] as number || 0), 0);
        acc[qty] = (sum / validProducts.length).toFixed(2);
      } else {
        acc[qty] = "N/A";
      }
      
      return acc;
    }, {} as Record<number, string>);
  };

  // Calculate total price for a product group based on selected quantity
  const calculateGroupTotal = (products: Product[], groupName: string) => {
    // Find average price for the selected quantity
    const selectedQty = selectedQuantities[groupName] || 0;
    
    if (selectedQty === 0) return 0;
    
    const priceKey = `price_${selectedQty}` as keyof Product;
    const validProducts = products.filter(p => p[priceKey] !== null && p[priceKey] !== undefined);
    
    if (validProducts.length === 0) return 0;
    
    const avgPrice = validProducts.reduce((sum, p) => sum + (p[priceKey] as number || 0), 0) / validProducts.length;
    return avgPrice * selectedQty;
  };

  // Calculate savings percentage between highest and selected price
  const calculateSavings = (products: Product[], groupName: string) => {
    const selectedQty = selectedQuantities[groupName] || 0;
    if (selectedQty === 0) return 0;
    
    const highestPriceKey = 'price_1000' as keyof Product;
    const selectedPriceKey = `price_${selectedQty}` as keyof Product;
    
    const validProducts = products.filter(p => 
      p[highestPriceKey] !== null && p[highestPriceKey] !== undefined &&
      p[selectedPriceKey] !== null && p[selectedPriceKey] !== undefined
    );
    
    if (validProducts.length === 0) return 0;
    
    const avgHighPrice = validProducts.reduce((sum, p) => sum + (p[highestPriceKey] as number || 0), 0) / validProducts.length;
    const avgSelectedPrice = validProducts.reduce((sum, p) => sum + (p[selectedPriceKey] as number || 0), 0) / validProducts.length;
    
    if (avgHighPrice === 0) return 0;
    return ((avgHighPrice - avgSelectedPrice) / avgHighPrice * 100);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
      <Table className="w-full">
        <TableHeader className="bg-[#1E1E1E]">
          <TableRow>
            <TableHead className="w-[250px] text-left pl-4">Produit (sans saveur)</TableHead>
            <TableHead className="text-center">Prix 1000</TableHead>
            <TableHead className="text-center">Prix 2000</TableHead>
            <TableHead className="text-center">Prix 3000</TableHead>
            <TableHead className="text-center">Prix 4000</TableHead>
            <TableHead className="text-center">Prix 5000</TableHead>
            <TableHead className="text-center">Quantité choisie</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedProducts).map(([groupName, products]) => {
            const prices = getGroupPrices(products);
            const total = calculateGroupTotal(products, groupName);
            const savings = calculateSavings(products, groupName);
            
            return (
              <TableRow key={groupName} className="border-b border-[#272727]">
                <TableCell className="pl-4 py-3 font-medium">
                  <div className="flex items-center">
                    {groupName}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400 ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1 max-w-xs">
                            <p className="text-xs font-semibold">Variantes incluses:</p>
                            {products.map((p) => (
                              <p key={p.id} className="text-xs">{p.product_name}</p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="text-center">{prices[1000]} €</TableCell>
                <TableCell className="text-center">{prices[2000]} €</TableCell>
                <TableCell className="text-center">{prices[3000]} €</TableCell>
                <TableCell className="text-center">{prices[4000]} €</TableCell>
                <TableCell className="text-center">{prices[5000]} €</TableCell>
                <TableCell className="text-center py-3">
                  <Select
                    value={selectedQuantities[groupName]?.toString() || "0"}
                    onValueChange={(value) => onQuantityChange(groupName, parseInt(value, 10))}
                  >
                    <SelectTrigger className="w-24 mx-auto">
                      <SelectValue placeholder="Quantité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      {quantityOptions.map((qty) => (
                        <SelectItem key={qty} value={qty.toString()}>
                          {qty}
                        </SelectItem>
                      ))}
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
