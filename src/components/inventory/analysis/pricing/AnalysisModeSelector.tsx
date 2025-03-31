
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, Zap } from 'lucide-react';

interface AnalysisModeSelectorProps {
  onManualAnalysis: () => void;
  onAIAnalysis: () => void;
}

const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({
  onManualAnalysis,
  onAIAnalysis
}) => {
  return (
    <div className="my-6 pt-6 border-t border-[#272727]">
      <div className="text-center mb-3">
        <h3 className="text-sm font-medium text-gray-400">Choisissez votre mode d'analyse</h3>
      </div>
      
      <div className="flex justify-center items-center gap-4">
        <Button 
          variant="secondary" 
          onClick={onManualAnalysis}
          className="min-w-[150px]"
        >
          <Wrench className="mr-2 h-4 w-4" />
          Analyse Manuelle
        </Button>
        
        <Button 
          variant="default" 
          onClick={onAIAnalysis}
          className="min-w-[150px]"
        >
          <Zap className="mr-2 h-4 w-4" />
          Analyse AI
        </Button>
      </div>
    </div>
  );
};

export default AnalysisModeSelector;
