
import React from 'react';
import { Button } from '@/components/ui/button';
import { Columns } from 'lucide-react';
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
}

interface ColumnVisibilityDropdownProps {
  columns: ColumnVisibility[];
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
}

export const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columns,
  onColumnVisibilityChange
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
        <DropdownMenuLabel className="text-gray-400">Visibilité des colonnes</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#272727]" />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="text-gray-300 focus:text-white focus:bg-[#272727]"
            checked={column.isVisible}
            onCheckedChange={(checked) => onColumnVisibilityChange(column.id, checked)}
          >
            {column.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
