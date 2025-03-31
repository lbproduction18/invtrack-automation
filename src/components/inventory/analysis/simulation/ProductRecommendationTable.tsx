
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type SimulationResult } from '@/hooks/useSimulationData';
import { Info } from 'lucide-react';

interface ProductRecommendationTableProps {
  results: SimulationResult[];
}

const ProductRecommendationTable: React.FC<ProductRecommendationTableProps> = ({ 
  results 
}) => {
  if (results.length === 0) {
    return (
      <div className="text-center p-6 bg-[#161616] border border-[#272727] rounded-md">
        <p className="text-gray-400">No product recommendations available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[#272727] overflow-hidden">
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader className="bg-[#161616] sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-left w-[120px]">SKU</TableHead>
              <TableHead className="text-left">Product</TableHead>
              <TableHead className="text-center w-[100px]">Quantity</TableHead>
              <TableHead className="text-right w-[150px]">Est. Cost</TableHead>
              <TableHead className="text-center w-[100px]">Priority</TableHead>
              <TableHead className="text-center w-[80px]">Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-mono text-xs">{result.sku_code}</TableCell>
                <TableCell>{result.product_name}</TableCell>
                <TableCell className="text-center">{result.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('fr-CA', { 
                    style: 'currency', 
                    currency: 'CAD',
                    maximumFractionDigits: 0 
                  }).format(result.estimated_cost)}
                </TableCell>
                <TableCell className="text-center">
                  {result.ai_priority && (
                    <Badge variant="outline" className="bg-amber-950/30 hover:bg-amber-950/40 border-amber-700 text-amber-400">
                      Priority
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {result.comment && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center justify-center cursor-help">
                            <Info className="h-4 w-4 text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">{result.comment}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ProductRecommendationTable;
