
import React, { useState } from 'react';
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
  onPriorityChange?: (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire') => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  columnVisibility,
  onPriorityChange = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Sort columns by order
  const sortedColumns = [...columnVisibility].sort((a, b) => a.order - b.order);

  const toggleExpand = () => {
    if (product.note) {
      setIsExpanded(!isExpanded);
    }
  };

  // Determine if this product has a note to apply special styling
  const hasNote = Boolean(product.note);

  return (
    <>
      <TableRow className={cn(
        "bg-transparent transition-colors", 
        hasNote ? "hover:bg-warning/10" : "hover:bg-muted/30",
        hasNote && "border-l-4 border-l-warning"
      )}>
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
            case 'note':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="text-center whitespace-nowrap p-1">
                  {product.note ? (
                    <button 
                      onClick={toggleExpand}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full p-1 transition-colors animate-pulse",
                        hasNote ? "bg-warning/20 hover:bg-warning/30 text-warning" : "hover:bg-muted/20"
                      )}
                      aria-label="Voir la note"
                    >
                      <span className="text-base">⚠️</span>
                    </button>
                  ) : null}
                </TableCell>
              );
            default:
              return null;
          }
        })}
      </TableRow>
      
      {isExpanded && product.note && (
        <TableRow className="bg-warning/10 border-t-0 border-l-4 border-l-warning">
          <TableCell colSpan={sortedColumns.filter(col => col.isVisible).length} className="px-4 py-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-lg mt-0.5">⚠️</span>
              <div className="text-warning-foreground font-medium">
                <span className="block text-warning text-sm uppercase tracking-wider font-bold mb-1">Note importante:</span>
                {product.note}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
