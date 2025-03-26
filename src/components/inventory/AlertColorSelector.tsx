
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAlertColorPreference, alertColorSchemes } from '@/hooks/useAlertColorPreference';
import { useToast } from '@/components/ui/use-toast';

export const AlertColorSelector: React.FC = () => {
  const { colorScheme, changeColorScheme, currentScheme } = useAlertColorPreference();
  const { toast } = useToast();

  const handleColorChange = (color: string) => {
    changeColorScheme(color);
    toast({
      title: "Préférence enregistrée",
      description: `Couleur de la note modifiée à ${alertColorSchemes[color].name}`,
      duration: 3000,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-transparent"
          aria-label="Changer la couleur de la note"
        >
          <Settings className={`h-4 w-4 ${currentScheme.iconColor}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-[#0F0F10] border border-[#1D1D20] p-3">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-white">Couleur de la note</h4>
          <p className="text-xs text-gray-400">Personnalisez l'apparence de la note de mise à jour</p>
          
          <RadioGroup 
            value={colorScheme} 
            onValueChange={handleColorChange}
            className="grid grid-cols-3 gap-2 mt-3"
          >
            {Object.entries(alertColorSchemes).map(([key, scheme]) => (
              <div key={key} className="flex flex-col items-center gap-1.5">
                <div className={`h-8 w-8 rounded-full ${scheme.background} cursor-pointer relative`}>
                  <RadioGroupItem 
                    value={key} 
                    id={`color-${key}`} 
                    className="sr-only"
                  />
                  {colorScheme === key && (
                    <div className="absolute inset-0 rounded-full border-2 border-white" />
                  )}
                </div>
                <label htmlFor={`color-${key}`} className="text-xs text-gray-300 cursor-pointer">
                  {scheme.name}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
};
