
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { type SimulationScenario } from '@/hooks/useSimulationData';

interface ScenarioCardProps {
  scenario: SimulationScenario;
  isActive: boolean;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ 
  scenario, 
  isActive, 
  onClick 
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isActive 
          ? 'bg-primary/10 border-primary/30' 
          : 'bg-[#161616] border-[#272727] hover:bg-[#1c1c1c]'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h3 className={`font-medium ${isActive ? 'text-primary' : 'text-gray-300'}`}>
          {scenario.name}
        </h3>
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="text-gray-400">
            {new Intl.NumberFormat('fr-CA', { 
              style: 'currency', 
              currency: 'CAD',
              maximumFractionDigits: 0 
            }).format(scenario.total_cost)}
          </span>
          <span className="text-gray-400">
            {scenario.total_skus} SKUs
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
