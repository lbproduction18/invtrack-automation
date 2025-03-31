
import React from 'react';
import { type SimulationScenario } from '@/hooks/useSimulationData';
import ScenarioCard from './ScenarioCard';

interface ScenarioSwitcherProps {
  scenarios: SimulationScenario[];
  activeScenarioId: string | null;
  onScenarioChange: (scenarioId: string) => void;
}

const ScenarioSwitcher: React.FC<ScenarioSwitcherProps> = ({
  scenarios,
  activeScenarioId,
  onScenarioChange
}) => {
  if (scenarios.length === 0) {
    return (
      <div className="text-center p-4 bg-[#161616] border border-[#272727] rounded-md">
        <p className="text-gray-400">No scenarios available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          isActive={scenario.id === activeScenarioId}
          onClick={() => onScenarioChange(scenario.id)}
        />
      ))}
    </div>
  );
};

export default ScenarioSwitcher;
