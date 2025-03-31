
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';

interface AnalysisModeSelectorProps {
  selectedMode: 'manual' | 'ai' | null;
  onSelectMode: (mode: 'manual' | 'ai') => void;
  isTransitioning?: boolean;
}

const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  isTransitioning = false
}) => {
  const manualButtonRef = useRef<HTMLButtonElement>(null);
  const aiButtonRef = useRef<HTMLButtonElement>(null);
  
  // Add highlight effect when mode changes
  useEffect(() => {
    if (isTransitioning) return; // Skip during transitions
    
    const buttonRef = selectedMode === 'manual' ? manualButtonRef.current : aiButtonRef.current;
    
    if (buttonRef) {
      // Add highlight class briefly
      buttonRef.classList.add('ring-2', 'ring-primary', 'ring-opacity-70');
      
      // Remove highlight after animation completes
      const timer = setTimeout(() => {
        buttonRef.classList.remove('ring-2', 'ring-primary', 'ring-opacity-70');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedMode, isTransitioning]);

  return (
    <div className="my-8 py-6 border-t border-[#272727] bg-[#161616] rounded-md p-4">
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-gray-300">Choisissez votre mode d'analyse</h3>
      </div>
      
      <div className="flex justify-center items-center gap-6">
        <Button 
          ref={manualButtonRef}
          variant={selectedMode === 'manual' ? 'default' : 'secondary'} 
          onClick={() => onSelectMode('manual')}
          className={`min-w-[180px] py-5 transition-all duration-200 ${
            isTransitioning ? 'pointer-events-none' : ''
          }`}
          size="lg"
          disabled={isTransitioning}
        >
          <Settings className="mr-2 h-5 w-5" />
          Analyse Manuelle
        </Button>
        
        <Button 
          ref={aiButtonRef}
          variant={selectedMode === 'ai' ? 'default' : 'secondary'} 
          onClick={() => onSelectMode('ai')}
          className={`min-w-[180px] py-5 transition-all duration-200 ${
            isTransitioning ? 'pointer-events-none' : ''
          }`}
          size="lg"
          disabled={isTransitioning}
        >
          <Zap className="mr-2 h-5 w-5" />
          Analyse AI
        </Button>
      </div>
    </div>
  );
};

export default AnalysisModeSelector;
