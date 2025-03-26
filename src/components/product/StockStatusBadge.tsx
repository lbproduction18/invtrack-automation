
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Flag, ArrowUp } from 'lucide-react';

interface StockStatusBadgeProps {
  stock: number;
  threshold: number;
}

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ stock, threshold }) => {
  // Déterminer le statut et le style du badge en fonction du niveau de priorité
  // La priorité est déterminée par le rapport entre le stock actuel et le seuil
  let status: 'high' | 'medium' | 'low' = 'low';
  let statusText = 'Basse';
  
  // Calcul du ratio pour déterminer la priorité
  const ratio = stock / threshold;
  
  if (stock <= 0) {
    status = 'high';
    statusText = 'Critique';
  } else if (ratio <= 0.5) {
    status = 'high';
    statusText = 'Haute';
  } else if (ratio <= 0.75) {
    status = 'medium';
    statusText = 'Moyenne';
  }
  
  // Les classes spécifiques en suivant la même logique que pour l'âge des produits
  const baseClasses = "px-2.5 py-0.5 font-medium text-xs rounded-full transition-all backdrop-blur-sm flex items-center gap-1";
  
  const statusClasses = {
    low: "bg-green-900/30 text-green-400 border border-green-900/20",
    medium: "bg-yellow-900/30 text-yellow-400 border border-yellow-900/20",
    high: "bg-red-900/30 text-red-400 border border-red-900/20"
  };

  // Ajouter un icône approprié selon le niveau de priorité
  const renderIcon = () => {
    if (status === 'high') {
      return <Flag className="h-3 w-3" />;
    } else if (status === 'medium') {
      return <ArrowUp className="h-3 w-3" />;
    }
    return null;
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        baseClasses,
        statusClasses[status]
      )}
    >
      {renderIcon()}
      {statusText}
    </Badge>
  );
};
