
import React, { useState, useEffect } from 'react';
import AnalysisModeSelector from './pricing/AnalysisModeSelector';
import PricingGrid from './pricing/PricingGrid';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalysisMode = 'manual' | 'ai' | null;

const AnalysisMethodSection: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('manual');
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      
      {/* Manual Analysis Mode */}
      {selectedMode === 'manual' && (
        <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <PricingGrid showSimulationSummary={true} />
        </div>
      )}
      
      {/* AI Analysis Mode */}
      {selectedMode === 'ai' && (
        <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className="space-y-6">
            <PricingGrid showSimulationSummary={false} />
            
            <Card className="border border-[#272727] bg-[#131313]">
              <CardHeader className="px-4 py-3 border-b border-[#272727]">
                <CardTitle className="text-sm font-medium">Analyse AI</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-400 text-center py-8">
                  AI analysis output will be generated in the next step, including recommendations and data visualizations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisMethodSection;
