
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RowActionsProps {
  onView: () => void;
  onRemove: () => void;
}

const RowActions: React.FC<RowActionsProps> = ({ onView, onRemove }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                "hover:bg-primary/10 hover:text-primary",
                "transition-colors duration-200"
              )}
              aria-label="Voir les détails"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1A1A1A] border-[#2A2A2A] text-xs rounded-md">
            <p>Voir les détails</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                "hover:bg-red-500/10 hover:text-red-400",
                "transition-colors duration-200"
              )}
              aria-label="Retirer de l'analyse"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1A1A1A] border-[#2A2A2A] text-xs rounded-md">
            <p>Retirer de l'analyse</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default RowActions;
