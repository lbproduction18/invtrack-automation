
import React from 'react';
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

interface SimulationTableHeaderProps {
  quantityOptions: QuantityOption[];
  simulationTotal: number;
  showSkuColumn?: boolean;
}

const SimulationTableHeader: React.FC<SimulationTableHeaderProps> = ({
  quantityOptions,
  simulationTotal,
  showSkuColumn = false
}) => {
  return (
    <TableHeader className="bg-[#161616] sticky top-0 z-10">
      <TableRow className="hover:bg-transparent border-b border-[#272727]">
        <TableHead className="text-left">Produit</TableHead>
        
        {quantityOptions.map(qty => (
          <TableHead key={qty} className="text-center">
            Prix {qty.toLocaleString()}
          </TableHead>
        ))}
        
        {showSkuColumn && (
          <TableHead className="text-center">
            SKU
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default SimulationTableHeader;
