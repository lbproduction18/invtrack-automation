
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
  return null; // Not used anymore - total is displayed in the SimulationSummary component
};

export default TotalSummary;
