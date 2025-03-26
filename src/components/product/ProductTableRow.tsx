
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { PriorityBadge } from './PriorityBadge';
import { PriorityDialog } from './PriorityDialog';

// Helper functions
const getDaysSinceAdded = (createdDate: string): number => {
  const created = new Date(createdDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getAgingColor = (days: number): string => {
  if (days < 7) {
    return "text-success font-medium"; // Vert pour moins d'une semaine
  } else if (days < 14) {
    return "text-warning font-medium"; // Orange pour 1-2 semaines
  } else {
    return "text-danger font-medium"; // Rouge pour plus de 2 semaines
  }
};

interface ProductTableRowProps {
  product: Product;
  columnVisibility: ColumnVisibility[];
  onPriorityChange: (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire') => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  columnVisibility,
  onPriorityChange
}) => {
  // Sort columns by order
  const sortedColumns = [...columnVisibility].sort((a, b) => a.order - b.order);

  return (
    <TableRow className="bg-transparent hover:bg-muted/30">
      {sortedColumns.map(column => {
        if (!column.isVisible) return null;
        
        switch(column.id) {
          case 'SKU':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="font-medium whitespace-nowrap p-1 text-left pl-3">
                {product.SKU}
              </TableCell>
            );
          case 'date':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="whitespace-nowrap p-1 text-center">
                {new Date(product.created_at).toLocaleDateString('fr-FR', {
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
            );
          case 'age':
            return (
              <TableCell 
                key={`${product.id}-${column.id}`} 
                className={cn("text-center whitespace-nowrap p-1", getAgingColor(getDaysSinceAdded(product.created_at)))}
              >
                {getDaysSinceAdded(product.created_at)} j
              </TableCell>
            );
          case 'priority':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="whitespace-nowrap p-1 text-center">
                <PriorityDialog
                  productId={product.id}
                  currentPriority={product.priority_badge}
                  onPriorityChange={(newPriority) => onPriorityChange(product.id, newPriority)}
                >
                  <div className="cursor-pointer flex justify-center">
                    <PriorityBadge priority={product.priority_badge} />
                  </div>
                </PriorityDialog>
              </TableCell>
            );
          case 'stock':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="text-center font-medium whitespace-nowrap p-1">
                {product.current_stock}
              </TableCell>
            );
          case 'threshold':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="text-center font-medium whitespace-nowrap p-1">
                {product.threshold}
              </TableCell>
            );
          default:
            return null;
        }
      })}
    </TableRow>
  );
};
