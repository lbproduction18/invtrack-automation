
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StockStatusBadgeProps {
  stock: number;
  threshold: number;
}

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ stock, threshold }) => {
  if (stock <= 0) {
    return (
      <Badge variant="outline" className="border-danger/50 text-danger bg-danger/10">
        Rupture
      </Badge>
    );
  } else if (stock <= threshold) {
    return (
      <Badge variant="outline" className="border-warning/50 text-warning bg-warning/10">
        Bas
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="border-success/50 text-success bg-success/10">
        Normal
      </Badge>
    );
  }
};
