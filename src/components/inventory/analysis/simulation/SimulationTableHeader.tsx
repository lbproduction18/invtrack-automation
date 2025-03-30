
import React from 'react';
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatTotalPrice } from '../pricing/PriceFormatter';
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
      <TableRow className="hover:bg-transparent">
        {/* Product column */}
        <TableHead className="text-left w-[25%] bg-[#161616] pl-4">Produit</TableHead>
        
        {/* SKU Column (optional) */}
        {showSkuColumn && (
          <TableHead className="text-left w-[20%] bg-[#161616]">SKU</TableHead>
        )}
        
        {/* Quantity columns */}
        {quantityOptions.map(qty => (
          <TableHead 
            key={`qty-${qty}`} 
            className="text-center bg-[#161616] whitespace-nowrap"
          >
            {qty.toLocaleString()}
          </TableHead>
        ))}
        
        {/* Total column */}
        <TableHead className="text-right pr-4 bg-[#161616]">
          <div className="flex flex-col items-end">
            <span>Total</span>
            <span className="text-xs text-primary">{formatTotalPrice(simulationTotal)}</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SimulationTableHeader;
