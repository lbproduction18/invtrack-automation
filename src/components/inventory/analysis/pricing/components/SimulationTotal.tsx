
import React from 'react';
import { formatTotalPrice } from '../PriceFormatter';
import { TableCell, TableRow } from "@/components/ui/table";

interface SimulationTotalProps {
  simulationTotal: number;
}

const SimulationTotal: React.FC<SimulationTotalProps> = ({ simulationTotal }) => {
  return (
    <TableRow className="hover:bg-[#161616] border-t border-[#272727]">
      <TableCell colSpan={4} className="text-right font-medium py-3">
        Total Général (CAD)
      </TableCell>
      <TableCell className="text-right py-3">
        <span className="font-bold text-green-500 text-lg">
          {formatTotalPrice(simulationTotal)}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default SimulationTotal;
