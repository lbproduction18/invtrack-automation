
import React, { useState } from 'react';
import MethodToggle from './MethodToggle';
import SimulationDashboard from './simulation/SimulationDashboard';
import BudgetSimulation from './BudgetSimulation';

const AIEnabledAnalysisContent: React.FC = () => {
  const [method, setMethod] = useState<'manual' | 'ai'>('manual');
  
  const handleMethodChange = (newMethod: 'manual' | 'ai') => {
    setMethod(newMethod);
  };
  
  return (
    <div className="space-y-6">
      <MethodToggle method={method} onMethodChange={handleMethodChange} />
      
      {method === 'manual' ? (
        <BudgetSimulation />
      ) : (
        <SimulationDashboard />
      )}
    </div>
  );
};

export default AIEnabledAnalysisContent;
