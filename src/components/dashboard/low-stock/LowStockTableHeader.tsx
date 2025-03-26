
import React from 'react';
import { TableHead, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface LowStockTableHeaderProps {
  isAllSelected: boolean;
  onToggleAll: () => void;
}

export const LowStockTableHeader: React.FC<LowStockTableHeaderProps> = ({ 
  isAllSelected, 
  onToggleAll 
}) => {
  return (
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox 
          checked={isAllSelected} 
          onCheckedChange={onToggleAll}
          aria-label="Select all"
        />
      </TableHead>
      <TableHead>Product</TableHead>
      <TableHead>SKU</TableHead>
      <TableHead className="text-right">Stock</TableHead>
      <TableHead className="text-right">Minimum</TableHead>
      <TableHead>Date Added</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  );
};
