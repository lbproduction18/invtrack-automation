
import React, { useState } from 'react';
import AnalysisModeSelector from './pricing/AnalysisModeSelector';
import PricingGrid from './pricing/PricingGrid';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      
      {/* Show PricingGrid regardless of selected mode */}
      <div className="animate-fade-in">
        <PricingGrid />
      </div>
      
      {selectedMode === 'ai' && (
        <div className="animate-fade-in mt-6">
          <Card className="border border-[#272727] bg-[#131313]">
            <CardHeader className="px-4 py-3 border-b border-[#272727]">
              <CardTitle className="text-sm font-medium">Analyse AI</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-400 text-center py-8">
                Interface d'analyse AI sera disponible dans la prochaine étape
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalysisMethodSection;
