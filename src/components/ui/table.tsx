
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const tableRef = React.useRef<HTMLTableElement>(null);
  
  React.useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    
    // Function to handle cell hover
    const handleCellHover = (e: MouseEvent) => {
      // Reset all previously highlighted cells
      table.querySelectorAll('td.column-hovered').forEach(cell => {
        cell.classList.remove('column-hovered');
      });
      
      const target = e.target as HTMLElement;
      if (target.tagName === 'TD') {
        const currentRow = target.closest('tr');
        const cellIndex = Array.from(currentRow?.cells || []).indexOf(target);
        
        // Find all rows above and including this one
        const allRows = Array.from(table.querySelectorAll('tbody tr'));
        const currentRowIndex = allRows.indexOf(currentRow as HTMLTableRowElement);
        
        // Add highlight class to cells in the same column up to the current row
        for (let i = 0; i <= currentRowIndex; i++) {
          const row = allRows[i];
          const cell = row.cells[cellIndex];
          if (cell) {
            cell.classList.add('column-hovered');
          }
        }
      }
    };
    
    // Function to handle mouse leave
    const handleTableLeave = () => {
      // Clear all highlights when mouse leaves the table
      table.querySelectorAll('td.column-hovered').forEach(cell => {
        cell.classList.remove('column-hovered');
      });
    };
    
    // Add event listeners
    table.addEventListener('mouseover', handleCellHover);
    table.addEventListener('mouseleave', handleTableLeave);
    
    return () => {
      // Clean up event listeners
      table.removeEventListener('mouseover', handleCellHover);
      table.removeEventListener('mouseleave', handleTableLeave);
    };
  }, []);
  
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={(node) => {
          // Assign to both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          tableRef.current = node;
        }}
        className={cn("w-full caption-bottom text-sm border-collapse", className)}
        {...props}
      />
    </div>
  );
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("sticky top-0 z-[100] bg-[#161616] w-full border-b border-border/30", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border/30 bg-muted/30 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border/20 transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/60",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-0 text-left align-middle text-xs font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 border-r border-[#403E43] last:border-r-0 bg-inherit",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-0 py-1 align-middle [&:has([role=checkbox])]:pr-0 border-r border-[#403E43] last:border-r-0", 
      "hover:z-[1]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
