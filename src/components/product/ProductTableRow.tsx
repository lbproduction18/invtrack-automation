
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
import NoteEditor from '@/components/notes/NoteEditor';
import { useNoteEditor } from '@/hooks/useNoteEditor';

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
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  
  const {
    note,
    isEditing: isEditingNote,
    isUpdating: isUpdatingNote,
    noteType,
    handleEdit: handleEditNote,
    handleCancel: handleCancelNote,
    handleSave: handleSaveNote
  } = useNoteEditor({
    itemId: product.id,
    initialNote: product.note || null,
    tableType: 'Low stock product'
  });
  
  // Sort columns by order
  const sortedColumns = [...columnVisibility].sort((a, b) => a.order - b.order);

  const toggleExpandNote = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    setIsNoteExpanded(!isNoteExpanded);
    
    // If opening and no note exists, go straight to edit mode
    if (!isNoteExpanded && !isEditingNote && !note) {
      handleEditNote();
    }
  };

  // Determine if this product has a note to apply special styling
  const hasNote = Boolean(note);
  
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
              return (
                <TableCell key={`${product.id}-${column.id}`} className={cn("text-center whitespace-nowrap p-1", priorityStyles.text)}>
                  <div className="flex justify-center">
                    <Button 
                      onClick={toggleExpandNote}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full p-1 transition-colors",
                        hasNote ? (noteType === 'info' ? "bg-sky-500/10 hover:bg-sky-500/20" : "bg-amber-500/10 hover:bg-amber-500/20") : "hover:bg-gray-500/20"
                      )}
                      variant="ghost"
                      size="sm"
                    >
                      {hasNote ? (
                        noteType === 'info' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        )
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      )}
                    </Button>
                  </div>
                </TableCell>
              );
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
      
      {isNoteExpanded && (
        <TableRow className={cn(
          priorityStyles.bg || `bg-${noteType}/10`,
          priorityStyles.text,
          "border-t-0",
          `border-l-4 ${priorityStyles.border || `border-${noteType}`}`
        )}>
          <TableCell colSpan={sortedColumns.filter(col => col.isVisible).length + 2} className="p-4">
            <NoteEditor 
              note={note}
              isEditing={isEditingNote}
              isUpdating={isUpdatingNote}
              noteType={noteType}
              onEdit={handleEditNote}
              onCancel={() => {
                handleCancelNote();
                if (!note) {
                  setIsNoteExpanded(false);
                }
              }}
              onSave={handleSaveNote}
              createdAt={product.created_at}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
