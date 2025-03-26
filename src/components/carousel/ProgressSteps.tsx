
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Step {
  name: string;
  description: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  totalSteps: number;
  onStepClick: (index: number) => void;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  totalSteps,
  onStepClick
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Étapes numérotées avec design amélioré */}
      <div className="flex justify-between px-4 items-center">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => onStepClick(index)}
            className={cn(
              "flex flex-col items-center cursor-pointer transition-all duration-300 px-3 py-2 rounded-md", 
              currentStep === index 
                ? "bg-[#1E1E1E]/50 text-[#3ECF8E] font-semibold" 
                : "text-gray-400 hover:text-white hover:bg-[#1E1E1E]/30"
            )}
          >
            <div className="text-base">{step.name}</div>
            <div className={cn(
              "text-xs mt-1",
              currentStep === index ? "text-gray-300" : "text-gray-500"
            )}>
              {step.description}
            </div>
          </button>
        ))}
      </div>
      
      {/* Barre de progression améliorée */}
      <div className="px-4 pt-2">
        <Progress 
          value={(currentStep / (totalSteps - 1)) * 100} 
          className="h-1.5" 
        />
        <div className="flex justify-between mt-1">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "w-4 h-4 rounded-full transition-all duration-300",
                currentStep >= index ? "bg-[#3ECF8E]" : "bg-[#272727]",
                index === currentStep && "ring-2 ring-offset-2 ring-offset-[#0F0F0F] ring-[#3ECF8E]/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
