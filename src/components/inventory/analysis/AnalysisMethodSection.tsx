
import React, { useState } from 'react';
import AnalysisModeSelector from './pricing/AnalysisModeSelector';
import PricingGrid from './pricing/PricingGrid';
import SharedAnalysisForm from './pricing/SharedAnalysisForm';

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
        <div className="animate-fade-in space-y-6">
          <div className="rounded-md border border-[#272727] bg-[#161616] p-4">
            <h3 className="text-sm font-medium mb-4 text-center text-gray-300">
              {selectedMode === 'manual' ? 'Interface d\'analyse manuelle' : 'Interface d\'analyse AI'}
            </h3>
            
            <SharedAnalysisForm />
          </div>
          
          <PricingGrid />
        </div>
      )}
    </div>
  );
};

export default AnalysisMethodSection;
