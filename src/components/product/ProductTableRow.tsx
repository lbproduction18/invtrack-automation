
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { PriorityBadge } from './PriorityBadge';
import { PriorityDialog } from './PriorityDialog';
import { StickyNote } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Sort columns by order
  const sortedColumns = [...columnVisibility].sort((a, b) => a.order - b.order);

  const toggleExpand = () => {
    if (product.note) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
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
            case 'note':
              return (
                <TableCell key={`${product.id}-${column.id}`} className="text-center whitespace-nowrap p-1">
                  {product.note ? (
                    <button 
                      onClick={toggleExpand}
                      className="inline-flex items-center justify-center hover:bg-muted/20 rounded-full p-1 transition-colors"
                      aria-label="Voir la note"
                    >
                      <StickyNote className="h-4 w-4 text-muted-foreground" />
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
        <TableRow className="bg-muted/10 border-t-0">
          <TableCell colSpan={sortedColumns.filter(col => col.isVisible).length} className="px-4 py-2 text-sm">
            <div className="text-muted-foreground">
              <span className="font-medium">Note:</span> {product.note}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
