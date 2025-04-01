
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AIAnalysisButtonProps {
  onLaunchAIAnalysis: () => void;
  className?: string;
}

const AIAnalysisButton: React.FC<AIAnalysisButtonProps> = ({ 
  onLaunchAIAnalysis,
  className = "" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 space-y-4 border border-[#272727] rounded-md">
      <Button 
        onClick={onLaunchAIAnalysis}
        size="lg"
        variant="default"
        className={`py-3 px-6 font-bold text-white transition-all duration-300 transform hover:scale-105 ${className}`}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Lancer l'analyse AI
      </Button>
      <p className="text-center text-sm text-gray-400 max-w-md">
        Cliquez pour lancer l'analyse AI des produits sélectionnés
      </p>
    </div>
  );
};

export default AIAnalysisButton;
