
import React from 'react';
import { TableCell } from "@/components/ui/table";

interface SKUCellProps {
  skuCode: string | null;
  skuLabel: string | null;
}

const SKUCell: React.FC<SKUCellProps> = ({ skuCode, skuLabel }) => {
  return (
    <TableCell className="font-medium whitespace-nowrap pl-4">
      <div className="flex flex-col">
        <span>{skuCode || '-'}</span>
        {skuLabel && (
          <span className="text-xs text-gray-400">{skuLabel}</span>
        )}
      </div>
    </TableCell>
  );
};

export default SKUCell;
