
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Flag, ArrowUp } from 'lucide-react';

interface StockStatusBadgeProps {
  stock: number;
  threshold: number;
  manualStatus?: 'high' | 'medium' | 'low' | null;
  onClick?: () => void;
  isClickable?: boolean;
}

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ 
  stock, 
  threshold, 
  manualStatus = null,
  onClick,
  isClickable = false
}) => {
  // Déterminer le statut et le style du badge en fonction du niveau de priorité
  // ou utiliser le statut manuel s'il est fourni
  let status: 'high' | 'medium' | 'low' = manualStatus || 'low'; // Par défaut "Basse"
  let statusText = 'Basse';
  
  // Si aucun statut manuel n'est fourni, calculer automatiquement
  if (!manualStatus) {
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
  } else {
    // Utiliser le texte correspondant au statut manuel
    statusText = manualStatus === 'high' ? 'Haute' : 
                 manualStatus === 'medium' ? 'Moyenne' : 'Basse';
                 
    // Si le statut manuel est 'high' et le stock est à zéro, afficher 'Critique'
    if (manualStatus === 'high' && stock <= 0) {
      statusText = 'Critique';
    }
  }
  
  // Les classes spécifiques au style Supabase
  const baseClasses = "px-2.5 py-0.5 font-medium text-xs rounded-full transition-all backdrop-blur-sm flex items-center gap-1";
  
  const statusClasses = {
    low: "bg-green-900/30 text-green-400 border border-green-900/20",
    medium: "bg-yellow-900/30 text-yellow-400 border border-yellow-900/20",
    high: "bg-red-900/30 text-red-400 border border-red-900/20"
  };

  const BadgeComponent = (
    <Badge 
      variant="outline" 
      className={cn(
        baseClasses,
        statusClasses[status],
        isClickable && "cursor-pointer hover:brightness-110"
      )}
    >
      {status === 'high' && <Flag className="h-3 w-3" />}
      {status === 'medium' && <ArrowUp className="h-3 w-3" />}
      {statusText}
    </Badge>
  );

  // Si le badge est cliquable, le wraper dans un div avec un gestionnaire de clic
  if (isClickable && onClick) {
    return (
      <button 
        onClick={onClick} 
        className="inline-block"
        style={{ cursor: 'pointer' }}
        type="button"
      >
        {BadgeComponent}
      </button>
    );
  }

  return BadgeComponent;
};
