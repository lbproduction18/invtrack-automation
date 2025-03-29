
import React from 'react';
import { 
  TableHeader,
  TableRow,
  TableHead
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
    <TableHeader>
      <TableRow>
        <TableHead className="w-[280px] pl-4">Produit</TableHead>
        
        {/* Price column headers for each quantity option */}
        {quantityOptions.map(qty => (
          <TableHead key={qty} className="text-center">
            {qty.toLocaleString()}
          </TableHead>
        ))}
        
        {/* SKU selection column */}
        <TableHead className="text-right pr-4 min-w-[300px]">
          {showSkuColumn ? "Sélectionner un SKU" : ""}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SimulationTableHeader;
