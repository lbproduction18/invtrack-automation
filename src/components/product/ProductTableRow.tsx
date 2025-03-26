
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';
import { ProductRowActions } from '@/components/product/ProductRowActions';
import { PriorityBadge } from '@/components/product/PriorityBadge';
import { NoteDisplay } from '@/components/product/NoteDisplay';

interface ProductTableRowProps {
  product: Product;
  columnVisibility: ColumnVisibility[];
  onProductUpdate?: (productId: string, updatedData: Partial<Product>) => void;
  onPriorityChange?: (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire') => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  columnVisibility,
  onProductUpdate = () => {},
  onPriorityChange = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getFormattedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getAgeDays = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      return differenceInDays(today, date);
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  };

  const toggleExpand = () => {
    if (product.note) {
      setIsExpanded(!isExpanded);
    }
  };

  const visibleColumns = columnVisibility
    .filter(col => col.isVisible)
    .sort((a, b) => a.order - b.order)
    .map(col => col.id);

  return (
    <>
      <TableRow className={`hover:bg-card/80 border-b border-border/20 transition-all ${isExpanded ? 'bg-card/80' : ''}`}>
        {visibleColumns.includes('SKU') && (
          <TableCell className="p-2 text-right pr-3">{product.SKU}</TableCell>
        )}
        {visibleColumns.includes('date') && (
          <TableCell className="p-2 text-center text-xs text-muted-foreground">
            {getFormattedDate(product.created_at)}
          </TableCell>
        )}
        {visibleColumns.includes('age') && (
          <TableCell className="p-2 text-center text-xs">
            {getAgeDays(product.created_at)} jours
          </TableCell>
        )}
        {visibleColumns.includes('priority') && (
          <TableCell className="p-2 text-center">
            <div className="flex justify-center">
              <PriorityBadge 
                priority={product.priority_badge} 
                onClick={() => {
                  // This would open a dialog or some interface to change priority
                  console.log('Open priority change interface');
                }}
              />
            </div>
          </TableCell>
        )}
        {visibleColumns.includes('stock') && (
          <TableCell className="p-2 text-center">
            <span className={product.current_stock <= 0 ? 'text-destructive font-medium' : ''}>
              {product.current_stock}
            </span>
          </TableCell>
        )}
        {visibleColumns.includes('threshold') && (
          <TableCell className="p-2 text-center text-muted-foreground">
            {product.threshold}
          </TableCell>
        )}
        {visibleColumns.includes('note') && (
          <TableCell className="p-2 text-center">
            <div className="flex justify-center">
              <NoteDisplay note={product.note} />
            </div>
          </TableCell>
        )}
      </TableRow>
      
      {isExpanded && product.note && (
        <TableRow className="bg-muted/20 border-b border-border/20">
          <TableCell colSpan={visibleColumns.length} className="p-4">
            <div className="text-sm text-muted-foreground">
              <strong>Note:</strong> {product.note}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
