
import React from 'react';

interface TotalSummaryProps {
  simulationTotal: number;
}

const TotalSummary: React.FC<TotalSummaryProps> = ({ simulationTotal }) => {
  const formatTotalPrice = (price: number): string => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="mt-4 p-4 rounded-md border border-[#272727] bg-[#161616] flex justify-between items-center">
      <h3 className="text-lg font-medium">Total de la simulation</h3>
      <div className="text-xl font-bold text-primary">
        {formatTotalPrice(simulationTotal)}
      </div>
    </div>
  );
};

export default TotalSummary;
