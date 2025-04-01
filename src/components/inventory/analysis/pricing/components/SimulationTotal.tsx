
import React from 'react';
import { formatTotalPrice } from '../PriceFormatter';
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';

interface SimulationTotalProps {
  simulationTotal: number;
}

const SimulationTotal: React.FC<SimulationTotalProps> = ({ simulationTotal }) => {
  return (
    <TableRow className="hover:bg-[#161616] border-t border-[#2A2A2A]">
      <TableCell colSpan={4} className="text-right font-medium py-4 tracking-wide">
        Total Général (CAD)
      </TableCell>
      <TableCell className="text-right py-4">
        <span className={cn(
          "font-bold text-green-500 text-lg tabular-nums",
          "transition-all duration-300 hover:scale-105"
        )}>
          {formatTotalPrice(simulationTotal)}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default SimulationTotal;
