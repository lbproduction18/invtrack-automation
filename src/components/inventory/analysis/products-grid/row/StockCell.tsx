
import React from 'react';
import { TableCell } from "@/components/ui/table";

interface StockCellProps {
  stock: number | null;
  threshold: number | null;
}

const StockCell: React.FC<StockCellProps> = ({ stock, threshold }) => {
  const isLowStock = stock !== null && threshold !== null && stock < threshold;
  
  return (
    <TableCell className="text-center">
      <span className={isLowStock ? "text-red-500 font-medium" : ""}>
        {stock !== null ? stock : '-'}
      </span>
    </TableCell>
  );
};

export default StockCell;
