
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
    success: "bg-success/10 text-success border border-success/20 hover:bg-success/15",
    warning: "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/15",
    danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15"
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
