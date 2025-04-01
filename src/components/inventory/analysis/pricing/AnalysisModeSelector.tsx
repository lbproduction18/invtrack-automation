
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Zap } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
    <div className="my-8 py-6 border-t border-[#272727] bg-gradient-to-b from-[#161616] to-[#131313] rounded-md p-4 shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-gray-300 tracking-wide">Choisissez votre mode d'analyse</h3>
      </div>
      
      <div className="flex justify-center items-center gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                ref={manualButtonRef}
                variant={selectedMode === 'manual' ? 'default' : 'secondary'} 
                onClick={() => onSelectMode('manual')}
                className={cn(
                  "min-w-[180px] py-5 transition-all duration-300",
                  isTransitioning ? 'pointer-events-none' : '',
                  selectedMode === 'manual' ? 'shadow-md' : '',
                  "hover:scale-105 rounded-md"
                )}
                size="lg"
                disabled={isTransitioning}
              >
                <Settings className="mr-2 h-5 w-5" />
                Analyse Manuelle
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1A1A1A] border-[#2A2A2A] text-xs rounded-md">
              <p>Entrer les sélections manuellement</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                ref={aiButtonRef}
                variant={selectedMode === 'ai' ? 'default' : 'secondary'} 
                onClick={() => onSelectMode('ai')}
                className={cn(
                  "min-w-[180px] py-5 transition-all duration-300",
                  isTransitioning ? 'pointer-events-none' : '',
                  selectedMode === 'ai' ? 'shadow-md' : '',
                  "hover:scale-105 rounded-md"
                )}
                size="lg"
                disabled={isTransitioning}
              >
                <Zap className="mr-2 h-5 w-5" />
                Analyse AI
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1A1A1A] border-[#2A2A2A] text-xs rounded-md">
              <p>Obtenir des recommandations intelligentes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AnalysisModeSelector;
