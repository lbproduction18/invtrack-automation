
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AIAnalysisButtonProps {
  onLaunchAIAnalysis: () => void;
}

const AIAnalysisButton: React.FC<AIAnalysisButtonProps> = ({ 
  onLaunchAIAnalysis 
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 mt-4 space-y-4">
      <Button 
        onClick={onLaunchAIAnalysis}
        size="lg"
        className="py-3 px-6 font-bold text-white transition-all duration-300 transform hover:scale-105"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Lancer l'analyse AI
      </Button>
      <p className="text-center text-sm text-gray-400 max-w-md">
        Toutes les associations SKU sont complètes. Vous pouvez maintenant lancer l'analyse AI.
      </p>
    </div>
  );
};

export default AIAnalysisButton;
