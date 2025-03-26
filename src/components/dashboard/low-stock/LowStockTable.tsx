
import React, { useState } from 'react';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart } from 'lucide-react';
import { LowStockTableHeader } from './LowStockTableHeader';
import { LowStockItem } from './LowStockItem';
import { SelectedItemsBar } from './SelectedItemsBar';
import { useLowStockItems } from './useLowStockItems';

export const LowStockTable: React.FC = () => {
  const {
    lowStockItems,
    selectedItems,
    manualStatuses,
    editingStatus,
    toggleItem,
    toggleAll,
    setEditingStatus,
    changeStatus
  } = useLowStockItems();
  
  return (
    <div>
      {selectedItems.length > 0 && (
        <SelectedItemsBar 
          selectedCount={selectedItems.length} 
        />
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <LowStockTableHeader 
              isAllSelected={selectedItems.length === lowStockItems.length && lowStockItems.length > 0}
              onToggleAll={toggleAll}
            />
          </TableHeader>
          <TableBody>
            {lowStockItems.map((item) => (
              <LowStockItem
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onToggle={() => toggleItem(item.id)}
                manualStatus={manualStatuses[item.id] || null}
                isEditing={editingStatus === item.id}
                onChangeStatus={changeStatus}
                onEditStatus={() => setEditingStatus(item.id)}
                onCancelEdit={() => setEditingStatus(null)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
