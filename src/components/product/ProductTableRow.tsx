
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { PriorityBadge } from './PriorityBadge';
import { PriorityDialog } from './PriorityDialog';
import { NoteContent } from './NoteContent';
import { getDaysSinceAdded, getAgingColor, formatDate } from './utils/dateUtils';
import { getNoteType } from './utils/noteUtils';
import { getPriorityStyles } from './utils/priorityUtils';

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
  
  // Déterminer le type de note et les styles associés
  const noteType = hasNote ? getNoteType(product.note || "") : "info";
  
  // Obtenir les styles basés sur la priorité (prioritaire au-dessus des notes)
  const priorityStyles = getPriorityStyles(product.priority_badge);

  return (
    <>
      <TableRow className={cn(
        "transition-colors", 
        priorityStyles.bg || (hasNote ? `bg-${noteType}/10` : ""),
        priorityStyles.hover || (hasNote ? `hover:bg-${noteType}/20` : "hover:bg-muted/30"),
        hasNote && `border-l-4 ${priorityStyles.border || `border-${noteType}`}`
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
                  {formatDate(product.created_at, {
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
                        `bg-${noteType}/10 hover:bg-${noteType}/20 text-${noteType}-foreground`
                      )}
                      aria-label="Voir la note"
                    >
                      {getNoteType(product.note) && getNoteIcon(getNoteType(product.note))}
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
        <TableRow className={cn(
          priorityStyles.bg || `bg-${noteType}/10`,
          "border-t-0",
          `border-l-4 ${priorityStyles.border || `border-${noteType}`}`
        )}>
          <TableCell colSpan={sortedColumns.filter(col => col.isVisible).length} className="p-0">
            <NoteContent 
              noteText={product.note}
              noteType={noteType}
              createdAt={product.created_at}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
