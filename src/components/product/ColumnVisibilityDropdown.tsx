
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Columns, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface ColumnVisibility {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
}

interface ColumnVisibilityDropdownProps {
  columns: ColumnVisibility[];
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
  onColumnOrderChange?: (columnId: string, direction: 'up' | 'down') => void;
  onColumnReorder?: (sourceIndex: number, destinationIndex: number) => void;
}

export const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columns,
  onColumnVisibilityChange,
  onColumnOrderChange,
  onColumnReorder
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Need to set some data for Firefox to enable drag
    e.dataTransfer.setData('text/plain', id); 
    
    // Add a visual effect
    if (e.currentTarget.classList) {
      setTimeout(() => {
        e.currentTarget.classList.add('opacity-50');
      }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItem(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;
    
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
    const sourceIndex = sortedColumns.findIndex(c => c.id === draggedItem);
    const destinationIndex = sortedColumns.findIndex(c => c.id === targetId);
    
    if (sourceIndex !== -1 && destinationIndex !== -1 && onColumnReorder) {
      onColumnReorder(sourceIndex, destinationIndex);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto h-8 bg-[#121212] border-[#272727] text-gray-300 hover:text-white"
        >
          <Columns className="h-4 w-4 mr-2" />
          Colonnes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#161616] border-[#272727]">
        <DropdownMenuLabel className="text-gray-400">Visibilité et ordre des colonnes</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#272727]" />
        {columns
          .sort((a, b) => a.order - b.order)
          .map((column) => (
            <div 
              key={column.id} 
              className="flex items-center px-2 py-1.5 cursor-move"
              draggable={true}
              onDragStart={(e) => handleDragStart(e, column.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center mr-2 text-gray-400">
                <GripVertical className="h-4 w-4" />
              </div>
              
              <DropdownMenuCheckboxItem
                className="flex-1 text-gray-300 focus:text-white focus:bg-[#272727]"
                checked={column.isVisible}
                onCheckedChange={(checked) => onColumnVisibilityChange(column.id, checked)}
              >
                {column.title}
              </DropdownMenuCheckboxItem>
              
              {onColumnOrderChange && (
                <div className="flex ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    onClick={() => onColumnOrderChange(column.id, 'up')}
                    disabled={columns.findIndex(c => c.id === column.id) === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 ml-1 text-gray-400 hover:text-white"
                    onClick={() => onColumnOrderChange(column.id, 'down')}
                    disabled={columns.findIndex(c => c.id === column.id) === columns.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
