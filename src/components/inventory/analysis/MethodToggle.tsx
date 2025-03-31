
import React from 'react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { BrainCog, Settings } from 'lucide-react';

interface MethodToggleProps {
  method: 'manual' | 'ai';
  onMethodChange: (method: 'manual' | 'ai') => void;
}

const MethodToggle: React.FC<MethodToggleProps> = ({
  method,
  onMethodChange
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-gray-200 mb-3">Méthode d'Analyse</h3>
      <ToggleGroup 
        type="single" 
        value={method}
        onValueChange={(value) => {
          if (value) onMethodChange(value as 'manual' | 'ai');
        }}
        className="border border-[#272727] rounded-md p-1 bg-[#161616]"
      >
        <ToggleGroupItem 
          value="manual" 
          className={`flex-1 flex items-center justify-center gap-2 text-sm px-4 py-2 ${
            method === 'manual' 
              ? 'bg-[#1c1c1c] text-white' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Manuelle</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="ai" 
          className={`flex-1 flex items-center justify-center gap-2 text-sm px-4 py-2 ${
            method === 'ai' 
              ? 'bg-[#1c1c1c] text-white' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <BrainCog className="h-4 w-4" />
          <span>IA</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default MethodToggle;
