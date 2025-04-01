
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SKUCellProps {
  skuCode: string | null;
  skuLabel: string | null;
  isComplete?: boolean;
}

const SKUCell: React.FC<SKUCellProps> = ({ skuCode, skuLabel, isComplete = false }) => {
  return (
    <TableCell className="py-3 pl-4">
      <div className="flex items-center space-x-2">
        {isComplete && (
          <span className="text-green-500 bg-green-500/10 p-1 rounded-full">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
        <div>
          <div className="font-semibold text-gray-200">{skuCode || "—"}</div>
          {skuLabel && (
            <div className="text-xs text-gray-500 mt-1">{skuLabel}</div>
          )}
        </div>
      </div>
    </TableCell>
  );
};

export default SKUCell;
