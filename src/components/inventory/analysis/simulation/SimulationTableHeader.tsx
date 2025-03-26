
import React from 'react';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

interface SimulationTableHeaderProps {
  quantityOptions: QuantityOption[];
  simulationTotal: number;
}

const SimulationTableHeader: React.FC<SimulationTableHeaderProps> = ({
  quantityOptions,
  simulationTotal
}) => {
  return (
    <thead className="bg-[#161616] sticky top-0 z-10">
      <tr className="hover:bg-transparent">
        <th className="text-xs text-left text-gray-400 w-1/5 py-3">Produit</th>
        {quantityOptions.map(qty => (
          <th key={qty} className="text-xs text-center text-gray-400 w-1/12 py-3">
            Prix {qty}
          </th>
        ))}
        <th className="text-xs text-right text-gray-400 w-1/6 py-3">
          {simulationTotal > 0 ? `Total: ${simulationTotal.toLocaleString()} $ CAD` : ''}
        </th>
      </tr>
    </thead>
  );
};

export default SimulationTableHeader;
