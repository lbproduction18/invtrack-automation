
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

type PriorityLevel = 'standard' | 'moyen' | 'prioritaire';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
  onClick?: () => void;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  className,
  onClick
}) => {
  // Déterminer les styles en fonction du niveau de priorité
  const getBadgeStyles = () => {
    switch (priority) {
      case 'prioritaire':
        return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/30";
      case 'moyen':
        return "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800/30";
      case 'standard':
      default:
        return "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/30";
    }
  };

  const isClickable = Boolean(onClick);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "px-2.5 py-0.5 font-normal text-xs rounded-full transition-all",
        getBadgeStyles(),
        isClickable && "cursor-pointer hover:brightness-105",
        className
      )}
      onClick={onClick}
    >
      {priority === 'prioritaire' && <Flag className="h-3 w-3 mr-1" />}
      {priority}
    </Badge>
  );
};
