
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Loader2, Check } from 'lucide-react';

interface DateFieldProps {
  value: Date | null;
  onSelect: (date: Date | null) => void;
  isUpdating: boolean;
  saveSuccess: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
  value,
  onSelect,
  isUpdating,
  saveSuccess
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full max-w-[120px] mx-auto bg-[#121212] border-[#272727] h-10 justify-between"
            disabled={isUpdating}
          >
            {value ? (
              format(new Date(value), 'P', { locale: fr })
            ) : (
              <span className="text-gray-500">Date</span>
            )}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#161616] border-[#272727] p-0">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={onSelect}
            className="bg-[#161616] pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      {saveSuccess && <Check className="w-4 h-4 text-green-500" />}
    </div>
  );
};

export default DateField;
