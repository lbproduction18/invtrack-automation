
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
        return "bg-red-50 text-red-700 border border-red-100";
      case 'moyen':
        return "bg-orange-50 text-orange-700 border border-orange-100";
      case 'standard':
      default:
        return "bg-green-50 text-green-700 border border-green-100";
    }
  };

  const isClickable = Boolean(onClick);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "px-2.5 py-0.5 font-medium text-xs rounded-full transition-all backdrop-blur-sm flex items-center gap-1",
        getBadgeStyles(),
        isClickable && "cursor-pointer hover:brightness-110",
        className
      )}
      onClick={onClick}
    >
      {priority === 'prioritaire' && <Flag className="h-3 w-3" />}
      {priority}
    </Badge>
  );
};
