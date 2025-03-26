
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flag, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';

type PriorityLevel = Product['priority_badge'];

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
        return "bg-red-900/30 text-red-400 border border-red-900/20";
      case 'important':
        return "bg-amber-900/30 text-amber-400 border border-amber-900/20";
      case 'moyen':
        return "bg-orange-900/30 text-orange-400 border border-orange-900/20";
      case 'standard':
      default:
        return "bg-green-900/30 text-green-400 border border-green-900/20";
    }
  };

  const getIcon = () => {
    switch (priority) {
      case 'prioritaire':
        return <Flag className="h-3 w-3" />;
      case 'important':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
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
      {getIcon()}
      {priority}
    </Badge>
  );
};
