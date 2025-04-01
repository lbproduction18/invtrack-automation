
import React from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  isUpdating: boolean;
  saveSuccess: boolean;
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
  isUpdating,
  saveSuccess,
  className = "w-32 bg-[#121212] border-[#272727] text-center"
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Input
        className={cn(
          className,
          "rounded-md transition-all duration-200",
          "focus:border-primary focus:ring-1 focus:ring-primary/30",
          value ? "hover:border-[#3ECF8E]/30" : "hover:border-red-500/30"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={isUpdating}
        aria-label={placeholder}
      />
      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      {saveSuccess && <Check className="w-4 h-4 text-green-500 animate-scale-in" />}
    </div>
  );
};

export default EditableField;
