
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, CalendarDays, FileText, AlertTriangle } from 'lucide-react';
import { formatTotalPrice } from './PriceFormatter';
import SimulationTotal from './components/SimulationTotal';
import { type AnalysisItem } from '@/types/analysisItem';
import { type Product } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';

interface SimulationSummaryProps {
  analysisItems: AnalysisItem[];
  products: Product[];
  simulationTotal: number;
  selectedSKUs: Record<string, string[]>;
  quantities: Record<string, Record<string, string>>;
  calculatedPrices: Record<string, Record<string, number | string>>;
  productPrices: ProductPrice[];
  getUnitPriceForSKU: (productId: string, sku: string, quantity?: string) => number;
}

const SimulationSummary: React.FC<SimulationSummaryProps> = ({
  analysisItems,
  products,
  simulationTotal,
  selectedSKUs,
  quantities,
  calculatedPrices,
  productPrices,
  getUnitPriceForSKU
}) => {
  // Combined selected SKUs across all products
  const allSelectedSKUs = Object.entries(selectedSKUs).flatMap(([productId, skus]) => {
    return skus.map(sku => ({
      productId,
      sku,
      quantity: quantities[productId]?.[sku] || "0",
      calculatedPrice: calculatedPrices[productId]?.[sku] || 0
    }));
  });

  // Only show items that have quantities and prices
  const itemsWithValues = allSelectedSKUs.filter(item => 
    item.quantity && 
    item.quantity !== "0" && 
    item.calculatedPrice && 
    item.calculatedPrice !== 0
  );

  // Get the product name for a SKU
  const getProductNameForSKU = (sku: string): string => {
    // Extract product category from SKU (e.g., "BNT" from "BNT-LOTUS")
    const skuParts = sku.split('-');
    const category = skuParts[0];
    
    // Find matching product from product prices
    const matchingPrice = productPrices.find(price => {
      const normalizedName = price.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const normalizedCategory = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedName.includes(normalizedCategory) || normalizedCategory.includes(normalizedName);
    });
    
    return matchingPrice?.product_name || sku;
  };
  
  // Get analysis item details for a SKU
  const getAnalysisItemForSKU = (sku: string): AnalysisItem | undefined => {
    return analysisItems.find(item => item.sku_code === sku);
  };

  return (
    <Card className="border border-[#272727] rounded-lg shadow-md overflow-hidden bg-[#0F0F0F]">
      <CardHeader className="px-5 py-4 border-b border-[#272727] bg-gradient-to-r from-[#131313] to-[#181818]">
        <CardTitle className="text-md font-medium flex items-center tracking-wide">
          <Clipboard className="h-4 w-4 mr-2" /> 
          Récapitulatif de la simulation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {itemsWithValues.length === 0 ? (
          <div className="p-6 text-center flex flex-col items-center text-gray-400">
            <AlertTriangle className="h-8 w-8 mb-2 text-yellow-500 opacity-70" />
            <p>Aucun SKU sélectionné pour la simulation</p>
            <p className="text-sm text-gray-500 mt-1">
              Veuillez ajouter des SKUs à la simulation pour voir le récapitulatif
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-[#272727] shadow-inner bg-[#121212] overflow-hidden">
            <ScrollArea className="h-[250px]">
              <Table>
                <TableHeader className="bg-[#161616] sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent border-b border-[#272727]">
                    <TableHead className="text-left tracking-wide">SKU</TableHead>
                    <TableHead className="text-center tracking-wide">
                      <div className="flex items-center justify-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> 
                        Délai (semaines)
                      </div>
                    </TableHead>
                    <TableHead className="text-center tracking-wide">
                      <div className="flex items-center justify-center">
                        <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> 
                        Note
                      </div>
                    </TableHead>
                    <TableHead className="text-center tracking-wide">Quantité</TableHead>
                    <TableHead className="text-right tracking-wide">Total (CAD)</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {itemsWithValues.map((item, index) => {
                    const analysisItem = getAnalysisItemForSKU(item.sku);
                    const productName = getProductNameForSKU(item.sku);
                    const numericQuantity = parseInt(item.quantity, 10);
                    const unitPrice = getUnitPriceForSKU(item.productId, item.sku, item.quantity);
                    const price = typeof item.calculatedPrice === 'number' ? 
                      item.calculatedPrice : 
                      parseFloat(item.calculatedPrice as string) || 0;
                      
                    return (
                      <TableRow 
                        key={`${item.sku}-${index}`} 
                        className={`hover:bg-[#1A1A1A] transition-colors duration-150 ${
                          index % 2 === 1 ? 'bg-[#0F0F0F]' : 'bg-[#121212]'
                        } ${index < itemsWithValues.length - 1 ? 'border-b border-[#272727]/60' : ''}`}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium text-gray-200">{item.sku}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{productName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {analysisItem?.weeks_delivery || "—"}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          <div className="max-w-[200px] truncate">
                            {analysisItem?.note ? (
                              <span className="text-gray-400">{analysisItem.note}</span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium tabular-nums">
                          {numericQuantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-green-500 font-semibold">
                          {formatTotalPrice(price)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  <SimulationTotal simulationTotal={simulationTotal} />
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationSummary;
