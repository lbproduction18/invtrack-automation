
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateFieldProps {
  value: Date | null;
  onSelect: (date: Date) => void;
  isUpdating: boolean;
  saveSuccess: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
  value,
  onSelect,
  isUpdating,
  saveSuccess
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onSelect(date);
      setOpen(false);
      
      // Focus on the button after selecting
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          size="sm"
          disabled={isUpdating}
          className={cn(
            "w-32 bg-[#121212] border-[#272727] h-9",
            "hover:bg-[#1A1A1A] hover:border-[#3A3A3A] rounded-md transition-all duration-200",
            "focus:ring-1 focus:ring-primary/30 focus:border-primary",
            !value && "text-gray-400"
          )}
          aria-label="Sélectionner une date"
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : saveSuccess ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          )}
          {value ? format(value, 'dd MMM yyyy', { locale: fr }) : "Choisir date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 bg-[#161616] border-[#2A2A2A] rounded-md shadow-lg" 
        align="center"
      >
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={handleSelect}
          initialFocus
          locale={fr}
          className="bg-[#161616] rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateField;
