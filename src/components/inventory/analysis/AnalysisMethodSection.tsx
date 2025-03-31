
import React, { useState } from 'react';
import AnalysisModeSelector from './pricing/AnalysisModeSelector';
import PricingGrid from './pricing/PricingGrid';

type AnalysisMode = 'manual' | 'ai' | null;

const AnalysisMethodSection: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>(null);

  const handleModeSelection = (mode: 'manual' | 'ai') => {
    setSelectedMode(prevMode => prevMode === mode ? null : mode);
  };

  return (
    <div className="space-y-6">
      <AnalysisModeSelector 
        selectedMode={selectedMode}
        onSelectMode={handleModeSelection}
      />
      
      {selectedMode && (
        <div className="animate-fade-in">
          <PricingGrid />
        </div>
      )}
    </div>
  );
};

export default AnalysisMethodSection;
