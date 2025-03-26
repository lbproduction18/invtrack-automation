
import React from 'react';
import { Button } from '@/components/ui/button';
import { Columns, ArrowUp, ArrowDown } from 'lucide-react';
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
  order: number;  // Ajout d'un ordre pour permettre la réorganisation
}

interface ColumnVisibilityDropdownProps {
  columns: ColumnVisibility[];
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
  onColumnOrderChange?: (columnId: string, direction: 'up' | 'down') => void;
}

export const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columns,
  onColumnVisibilityChange,
  onColumnOrderChange
}) => {
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
            <div key={column.id} className="flex items-center px-2 py-1.5">
              {column.id === 'SKU' ? (
                <DropdownMenuCheckboxItem
                  className="flex-1 text-gray-300 focus:text-white focus:bg-[#272727]"
                  checked={true}
                  disabled={true}
                  onCheckedChange={() => {}}
                >
                  {column.title} (obligatoire)
                </DropdownMenuCheckboxItem>
              ) : (
                <DropdownMenuCheckboxItem
                  className="flex-1 text-gray-300 focus:text-white focus:bg-[#272727]"
                  checked={column.isVisible}
                  onCheckedChange={(checked) => onColumnVisibilityChange(column.id, checked)}
                >
                  {column.title}
                </DropdownMenuCheckboxItem>
              )}
              
              {onColumnOrderChange && (
                <div className="flex ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    onClick={() => onColumnOrderChange(column.id, 'up')}
                    disabled={columns.findIndex(c => c.id === column.id) === 0 || column.id === 'SKU'}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 ml-1 text-gray-400 hover:text-white"
                    onClick={() => onColumnOrderChange(column.id, 'down')}
                    disabled={columns.findIndex(c => c.id === column.id) === columns.length - 1 || column.id === 'SKU'}
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
