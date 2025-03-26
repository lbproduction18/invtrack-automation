
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { PriorityBadge } from './PriorityBadge';
import { PriorityDialog } from './PriorityDialog';
import { ProductRowActions } from './ProductRowActions';

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
              <TableCell key={`${product.id}-${column.id}`} className="font-medium">
                {product.SKU}
              </TableCell>
            );
          case 'date':
            return (
              <TableCell key={`${product.id}-${column.id}`}>
                {new Date(product.created_at).toLocaleDateString('fr-FR', {
                  month: 'short',
                  day: 'numeric'
                })}
              </TableCell>
            );
          case 'stock':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="text-right font-medium w-24">
                {product.current_stock}
              </TableCell>
            );
          case 'threshold':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="text-right font-medium w-24">
                {product.threshold}
              </TableCell>
            );
          case 'age':
            return (
              <TableCell 
                key={`${product.id}-${column.id}`} 
                className={cn("text-right w-24", getAgingColor(getDaysSinceAdded(product.created_at)))}
              >
                {getDaysSinceAdded(product.created_at)} jours
              </TableCell>
            );
          case 'priority':
            return (
              <TableCell key={`${product.id}-${column.id}`} className="w-28">
                <PriorityDialog
                  productId={product.id}
                  currentPriority={product.priority_badge}
                  onPriorityChange={(newPriority) => onPriorityChange(product.id, newPriority)}
                >
                  <div className="cursor-pointer">
                    <PriorityBadge priority={product.priority_badge} />
                  </div>
                </PriorityDialog>
              </TableCell>
            );
          default:
            return null;
        }
      })}
      
      <TableCell className="text-right">
        <ProductRowActions 
          product={product} 
          onPriorityChange={onPriorityChange} 
        />
      </TableCell>
    </TableRow>
  );
};
