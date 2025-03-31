
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalysisItem } from '@/types/analysisItem';
import { Product } from '@/types/product';
import SimulationTableBody from './SimulationTableBody';

interface SimulationTableProps {
  refreshedAnalysisItems: AnalysisItem[];
  products: Product[];
}

const SimulationTable: React.FC<SimulationTableProps> = ({
  refreshedAnalysisItems,
  products
}) => {
  return (
    <ScrollArea className="h-[250px]">
      <Table>
        <TableHeader className="bg-[#161616] sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-left">SKU</TableHead>
            <TableHead className="text-center">Quantité choisie</TableHead>
            <TableHead className="text-right">Total (CAD)</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          <SimulationTableBody 
            refreshedAnalysisItems={refreshedAnalysisItems} 
            products={products} 
          />
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default SimulationTable;
