
import React, { useState } from 'react';
import AnalysisModeSelector from './pricing/AnalysisModeSelector';
import PricingGrid from './pricing/PricingGrid';
import AIAnalysisInputs from './pricing/components/AIAnalysisInputs';

type AnalysisMode = 'manual' | 'ai' | null;

const AnalysisMethodSection: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('manual');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [budget, setBudget] = useState<number>(325000);
  const [aiNotes, setAiNotes] = useState<string>('');

  const handleModeSelection = (mode: 'manual' | 'ai') => {
    if (selectedMode !== mode) {
      setIsTransitioning(true);
      // Short timeout to trigger the exit animation
      setTimeout(() => {
        setSelectedMode(mode);
        // Reset transitioning state after content has changed
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50); // Small delay to ensure the new content gets the entrance animation
      }, 200); // Duration for exit animation
    }
  };

  return (
    <div className="space-y-6">
      <AnalysisModeSelector 
        selectedMode={selectedMode}
        onSelectMode={handleModeSelection}
        isTransitioning={isTransitioning}
      />
      
      {/* AI Analysis Input Section - Only visible in AI mode */}
      {selectedMode === 'ai' && (
        <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <AIAnalysisInputs
            budget={budget}
            onBudgetChange={setBudget}
            notes={aiNotes}
            onNotesChange={setAiNotes}
          />
        </div>
      )}
      
      {/* Manual Analysis Mode */}
      {selectedMode === 'manual' && (
        <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <PricingGrid 
            showSimulationSummary={true} 
            analysisMode="manual"
          />
        </div>
      )}
      
      {/* AI Analysis Mode */}
      {selectedMode === 'ai' && (
        <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <PricingGrid 
            showSimulationSummary={false} 
            analysisMode="ai"
          />
          
          {/* Removed the "Analyse AI" card */}
        </div>
      )}
    </div>
  );
};

export default AnalysisMethodSection;
