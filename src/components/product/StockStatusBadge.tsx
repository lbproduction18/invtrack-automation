
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StockStatusBadgeProps {
  stock: number;
  threshold: number;
}

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ stock, threshold }) => {
  // Déterminer le statut et le style du badge en fonction du niveau de stock
  let status: 'danger' | 'warning' | 'success' = 'success';
  let statusText = 'Normal';
  
  if (stock <= 0) {
    status = 'danger';
    statusText = 'Rupture';
  } else if (stock <= threshold) {
    status = 'warning';
    statusText = 'Bas';
  }
  
  // Les classes spécifiques au style Supabase
  const baseClasses = "px-2.5 py-0.5 font-medium text-xs rounded-full transition-all backdrop-blur-sm";
  
  const statusClasses = {
    success: "bg-green-900/30 text-green-400 border border-green-900/20",
    warning: "bg-yellow-900/30 text-yellow-400 border border-yellow-900/20",
    danger: "bg-red-900/30 text-red-400 border border-red-900/20"
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        baseClasses,
        statusClasses[status]
      )}
    >
      {statusText}
    </Badge>
  );
};
