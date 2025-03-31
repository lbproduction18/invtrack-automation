
import React from 'react';
import { formatTotalPrice } from './PriceFormatter';
import { 
  Card,
  CardContent,
} from "@/components/ui/card";

interface TotalSummaryProps {
  simulationTotal: number;
}

const TotalSummary: React.FC<TotalSummaryProps> = ({ simulationTotal }) => {
  return (
    <Card className="border border-[#272727] bg-[#161616]">
      <CardContent className="flex justify-between items-center p-4">
        <span className="font-medium">Total de la simulation</span>
        <span className="font-bold text-green-500 text-lg">
          {formatTotalPrice(simulationTotal)}
        </span>
      </CardContent>
    </Card>
  );
};

export default TotalSummary;
