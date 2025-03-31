
import React from 'react';
import { formatTotalPrice } from '../PriceFormatter';
import { TableCell, TableRow } from "@/components/ui/table";

interface SimulationTotalProps {
  simulationTotal: number;
}

const SimulationTotal: React.FC<SimulationTotalProps> = ({ simulationTotal }) => {
  return (
    <TableRow className="bg-[#161616] border-t border-[#272727] hover:bg-[#161616]">
      <TableCell colSpan={4} className="py-3 font-medium text-right">
        Total de la simulation
      </TableCell>
      <TableCell className="py-3 text-right">
        <span className="font-bold text-green-500 text-lg">
          {formatTotalPrice(simulationTotal)}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default SimulationTotal;
