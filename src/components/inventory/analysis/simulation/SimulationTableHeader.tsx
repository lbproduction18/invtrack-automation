
import React from 'react';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

interface SimulationTableHeaderProps {
  quantityOptions: QuantityOption[];
  trancheTotals: Record<QuantityOption, number>;
  simulationTotal: number;
}

const SimulationTableHeader: React.FC<SimulationTableHeaderProps> = ({
  quantityOptions,
  trancheTotals,
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
        <th className="text-xs text-center text-gray-400 w-1/6 py-3">Saveur (SKU)</th>
        <th className="text-xs text-right text-gray-400 w-1/12 py-3"></th>
      </tr>
      
      {/* Tranche totals row */}
      <tr className="hover:bg-[#1A1A1A] bg-[#1A1A1A] border-t border-[#272727]">
        <th className="font-medium text-gray-400 py-3 text-left">Total par tranche</th>
        {quantityOptions.map(qty => (
          <th key={qty} className="text-center font-medium text-gray-300 py-3">
            {trancheTotals[qty] > 0 ? `${trancheTotals[qty].toLocaleString()} $ CAD` : '-'}
          </th>
        ))}
        <th className="py-3"></th>
        <th className="text-right font-medium text-white py-3">
          {simulationTotal > 0 ? `${simulationTotal.toLocaleString()} $ CAD` : '-'}
        </th>
      </tr>
    </thead>
  );
};

export default SimulationTableHeader;
