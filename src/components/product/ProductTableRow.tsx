
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Product } from '@/types/product';
import { type ColumnVisibility } from './ColumnVisibilityDropdown';
import { NoteContent } from './NoteContent';
import { getPriorityStyles } from './utils/priorityUtils';
import { getNoteType } from './utils/noteUtils';
import { 
  SKUCell, 
  DateCell, 
  AgeCell, 
  PriorityCell, 
  StockCell, 
  ThresholdCell, 
  NoteCell 
} from './CellRenderers';

interface ProductTableRowProps {
  product: Product;
  columnVisibility: ColumnVisibility[];
  onPriorityChange?: (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire' | 'important') => void;
  isSelected?: boolean;
  onSelect?: () => void;
  showAnalysisButton?: boolean;
  onSendToAnalysis?: (productId: string) => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  columnVisibility,
  onPriorityChange = () => {},
  isSelected = false,
  onSelect = () => {},
  showAnalysisButton = false,
  onSendToAnalysis = () => {}
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
  
  // Determine the note type and associated styles
  const noteType = hasNote ? getNoteType(product.note || "") : "info";
  
  // Get styles based on priority (priority takes precedence over notes)
  const priorityStyles = getPriorityStyles(product.priority_badge);

  return (
    <>
      <TableRow className={cn(
        "transition-colors", 
        priorityStyles.bg || (hasNote ? `bg-${noteType}/10` : ""),
        priorityStyles.hover || (hasNote ? `hover:bg-${noteType}/20` : "hover:bg-muted/30"),
        hasNote && `border-l-4 ${priorityStyles.border || `border-${noteType}`}`,
        product.priority_badge === 'prioritaire' && "font-semibold",
        priorityStyles.text,
        isSelected && "bg-primary/5 hover:bg-primary/10"
      )}>
        <TableCell className="w-[40px] p-1 text-center">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label={`Select ${product.SKU}`}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </TableCell>
        {sortedColumns.map(column => {
          if (!column.isVisible) return null;
          
          switch(column.id) {
            case 'SKU':
              return <SKUCell key={`${product.id}-${column.id}`} product={product} priorityStyles={priorityStyles} />;
            case 'date':
              return <DateCell key={`${product.id}-${column.id}`} product={product} priorityStyles={priorityStyles} />;
            case 'age':
              return <AgeCell key={`${product.id}-${column.id}`} product={product} priorityStyles={priorityStyles} />;
            case 'priority':
              return <PriorityCell key={`${product.id}-${column.id}`} product={product} priorityStyles={priorityStyles} onPriorityChange={onPriorityChange} />;
            case 'stock':
              return <StockCell key={`${product.id}-${column.id}`} product={product} priorityStyles={priorityStyles} />;
            case 'threshold':
              return <ThresholdCell key={`${product.id}-${column.id}`} product={product} priorityStyles={priorityStyles} />;
            case 'note':
              return <NoteCell key={`${product.id}-${column.id}`} product={product} priorityStyles={priorityStyles} toggleExpand={toggleExpand} />;
            default:
              return null;
          }
        })}
        <TableCell className="text-right whitespace-nowrap p-1">
          {showAnalysisButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2"
              onClick={() => onSendToAnalysis(product.id)}
            >
              <ChevronRight className="mr-1 h-3 w-3" />
              Analyser
            </Button>
          )}
        </TableCell>
      </TableRow>
      
      {isExpanded && product.note && (
        <TableRow className={cn(
          priorityStyles.bg || `bg-${noteType}/10`,
          priorityStyles.text,
          "border-t-0",
          `border-l-4 ${priorityStyles.border || `border-${noteType}`}`
        )}>
          <TableCell colSpan={sortedColumns.filter(col => col.isVisible).length + 2} className="p-0">
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
