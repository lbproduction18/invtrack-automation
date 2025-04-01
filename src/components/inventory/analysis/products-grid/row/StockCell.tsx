
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface StockCellProps {
  stock: number | null;
  threshold: number | null;
}

const StockCell: React.FC<StockCellProps> = ({ stock, threshold }) => {
  // Calculate stock status for styling
  const isLowStock = stock !== null && threshold !== null && stock < threshold;
  const isVeryLowStock = stock !== null && stock < (threshold || 0) * 0.5;
  const stockPercentage = threshold ? Math.min(100, Math.round((stock || 0) / threshold * 100)) : 0;
  
  return (
    <TableCell className="text-center py-3">
      <div className="flex flex-col items-center">
        <span className={cn(
          "font-semibold tabular-nums",
          isVeryLowStock ? "text-red-500" : 
          isLowStock ? "text-yellow-500" : 
          "text-green-500"
        )}>
          {stock ?? "—"}
        </span>
        
        {stock !== null && threshold !== null && (
          <div className="w-16 h-1.5 bg-gray-700 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                isVeryLowStock ? "bg-red-500" : 
                isLowStock ? "bg-yellow-500" : 
                "bg-green-500"
              )}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
        )}
      </div>
    </TableCell>
  );
};

export default StockCell;
