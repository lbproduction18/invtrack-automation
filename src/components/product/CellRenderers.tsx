import React from 'react';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { PriorityDialog } from './PriorityDialog';
import { formatDate, getDaysSinceAdded, getAgingColor } from './utils/dateUtils';
import { getNoteType, getNoteIconInfo, type NoteType } from './utils/noteUtils';
import { type PriorityLevel } from '@/types/product';

interface CellProps {
  product: any;
  className?: string;
  priorityStyles: {
    text?: string;
    bg?: string;
    hover?: string;
    border?: string;
  };
  onPriorityChange?: (productId: string, newPriority: PriorityLevel) => void;
  toggleExpand?: () => void;
}

export const SKUCell: React.FC<CellProps> = ({ product, className, priorityStyles }) => (
  <TableCell 
    className={cn(
      "font-medium whitespace-nowrap p-1 text-left pl-3",
      priorityStyles.text || (product.priority_badge === 'prioritaire' ? "text-white" : ""),
      className
    )}
  >
    {product.SKU}
  </TableCell>
);

export const DateCell: React.FC<CellProps> = ({ product, className, priorityStyles }) => (
  <TableCell 
    className={cn("whitespace-nowrap p-1 text-center", priorityStyles.text, className)}
  >
    {formatDate(product.created_at, {
      month: 'short',
      day: 'numeric'
    })}
  </TableCell>
);

export const AgeCell: React.FC<CellProps> = ({ product, className, priorityStyles }) => {
  const days = getDaysSinceAdded(product.created_at);
  return (
    <TableCell 
      className={cn(
        "text-center whitespace-nowrap p-1", 
        priorityStyles.text || getAgingColor(days),
        className
      )}
    >
      {days} j
    </TableCell>
  );
};

export const PriorityCell: React.FC<CellProps> = ({ product, className, priorityStyles, onPriorityChange }) => (
  <TableCell className={cn("whitespace-nowrap p-1 text-center", priorityStyles.text, className)}>
    <PriorityDialog
      productId={product.id}
      currentPriority={product.priority_badge}
      onPriorityChange={(newPriority) => onPriorityChange && onPriorityChange(product.id, newPriority)}
    >
      <div className="cursor-pointer flex justify-center">
        <PriorityBadge priority={product.priority_badge} />
      </div>
    </PriorityDialog>
  </TableCell>
);

export const StockCell: React.FC<CellProps> = ({ product, className, priorityStyles }) => (
  <TableCell className={cn("text-center font-medium whitespace-nowrap p-1", priorityStyles.text, className)}>
    {product.current_stock}
  </TableCell>
);

export const ThresholdCell: React.FC<CellProps> = ({ product, className, priorityStyles }) => (
  <TableCell className={cn("text-center font-medium whitespace-nowrap p-1", priorityStyles.text, className)}>
    {product.threshold}
  </TableCell>
);

export const NoteCell: React.FC<CellProps> = ({ product, className, priorityStyles, toggleExpand }) => {
  if (!product.note) return (
    <TableCell className={cn("text-center whitespace-nowrap p-1", priorityStyles.text, className)}>
      {null}
    </TableCell>
  );

  const noteType = getNoteType(product.note);
  const { icon: IconComponent, className: iconClassName } = getNoteIconInfo(noteType);

  return (
    <TableCell className={cn("text-center whitespace-nowrap p-1", priorityStyles.text, className)}>
      <button 
        onClick={toggleExpand}
        className={cn(
          "inline-flex items-center justify-center rounded-full p-1 transition-colors animate-pulse",
          `bg-${noteType}/10 hover:bg-${noteType}/20 text-${noteType}-foreground`
        )}
        aria-label="Voir la note"
      >
        <IconComponent className={iconClassName} />
      </button>
    </TableCell>
  );
};
