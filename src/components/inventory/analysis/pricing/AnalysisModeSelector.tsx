
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';

interface AnalysisModeSelectorProps {
  selectedMode: 'manual' | 'ai' | null;
  onSelectMode: (mode: 'manual' | 'ai') => void;
}

const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({
  selectedMode,
  onSelectMode
}) => {
  return (
    <div className="my-8 py-6 border-t border-[#272727] bg-[#161616] rounded-md p-4">
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-gray-300">Choisissez votre mode d'analyse</h3>
      </div>
      
      <div className="flex justify-center items-center gap-6">
        <Button 
          variant={selectedMode === 'manual' ? 'default' : 'secondary'} 
          onClick={() => onSelectMode('manual')}
          className="min-w-[180px] py-5"
          size="lg"
        >
          <Settings className="mr-2 h-5 w-5" />
          Analyse Manuelle
        </Button>
        
        <Button 
          variant={selectedMode === 'ai' ? 'default' : 'secondary'} 
          onClick={() => onSelectMode('ai')}
          className="min-w-[180px] py-5"
          size="lg"
        >
          <Zap className="mr-2 h-5 w-5" />
          Analyse AI
        </Button>
      </div>
    </div>
  );
};

export default AnalysisModeSelector;
