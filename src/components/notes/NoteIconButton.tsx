
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteIconButtonProps {
  hasNote: boolean;
  noteType?: 'info' | 'warning';
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const NoteIconButton: React.FC<NoteIconButtonProps> = ({
  hasNote,
  noteType = 'info',
  onClick,
  className
}) => {
  const getIcon = () => {
    if (!hasNote) {
      return <Pencil className="h-4 w-4 text-gray-400" />;
    }
    
    return noteType === 'info' 
      ? <Info className="h-4 w-4 text-sky-500" />
      : <AlertTriangle className="h-4 w-4 text-amber-500" />;
  };

  const getBgColor = () => {
    if (!hasNote) {
      return 'hover:bg-gray-500/20';
    }
    
    return noteType === 'info'
      ? 'bg-sky-500/10 hover:bg-sky-500/20'
      : 'bg-amber-500/10 hover:bg-amber-500/20';
  };

  const getTooltipText = () => {
    return hasNote ? 'Voir/Modifier la note' : 'Ajouter une note';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-1 rounded-full",
              getBgColor(),
              className
            )}
          >
            {getIcon()}
            <span className="sr-only">{getTooltipText()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NoteIconButton;
