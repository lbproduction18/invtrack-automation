
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { useBudgetSettings } from '@/hooks/useBudgetSettings';
import { formatTotalPrice } from '../PriceFormatter';
import { DollarSign } from 'lucide-react';

interface BudgetSliderProps {
  simulationTotal: number;
  className?: string;
}

const BudgetSlider: React.FC<BudgetSliderProps> = ({ 
  simulationTotal,
  className = ""
}) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const { budgetSettings } = useBudgetSettings();
  
  // Optional: Initialize from settings if available
  useEffect(() => {
    if (budgetSettings?.total_budget) {
      setSliderValue(budgetSettings.total_budget);
    }
  }, [budgetSettings]);
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };
  
  const remainingBudget = Math.max(0, sliderValue - simulationTotal);
  const budgetExceeded = simulationTotal > sliderValue && sliderValue > 0;
  
  return (
    <div className={`space-y-4 py-4 px-2 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm font-medium text-gray-300">
          <DollarSign className="h-4 w-4 mr-1 text-green-400" />
          <span>Budget Total:</span>
        </div>
        <span className="font-mono font-semibold text-right text-lg text-green-400">
          {formatTotalPrice(sliderValue)}
        </span>
      </div>
      
      <Slider
        defaultValue={[0]}
        value={[sliderValue]}
        max={1000000}
        step={1000}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      
      <div className="flex items-center justify-between text-sm mt-1">
        <div>
          <span className="text-gray-400 mr-1">Commande actuelle:</span>
          <span className={`font-mono font-medium ${budgetExceeded ? 'text-red-400' : 'text-green-300'}`}>
            {formatTotalPrice(simulationTotal)}
          </span>
        </div>
        {sliderValue > 0 && (
          <div>
            <span className="text-gray-400 mr-1">Restant:</span>
            <span className={`font-mono font-medium ${budgetExceeded ? 'text-red-400' : 'text-green-300'}`}>
              {budgetExceeded 
                ? `-${formatTotalPrice(simulationTotal - sliderValue)}` 
                : formatTotalPrice(remainingBudget)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSlider;
