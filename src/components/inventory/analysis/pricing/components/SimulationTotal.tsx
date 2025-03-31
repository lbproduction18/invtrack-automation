
import React from 'react';
import { formatTotalPrice } from '../PriceFormatter';

interface SimulationTotalProps {
  simulationTotal: number;
}

const SimulationTotal: React.FC<SimulationTotalProps> = ({ simulationTotal }) => {
  return (
    <div className="p-4 border-t border-[#272727] bg-[#161616] flex justify-between items-center">
      <h4 className="font-medium">Total</h4>
      <div className="font-bold text-primary">
        {formatTotalPrice(simulationTotal)}
      </div>
    </div>
  );
};

export default SimulationTotal;
