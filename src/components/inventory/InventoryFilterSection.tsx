
import React from 'react';
import { ProductFilterControls } from '@/components/product/ProductFilterControls';
import { ColumnVisibilityDropdown, type ColumnVisibility } from '@/components/product/ColumnVisibilityDropdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type SortOption } from '@/components/product/FilteredProductsList';

interface InventoryFilterSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stockFilter: string;
  setStockFilter: (filter: string) => void;
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  columnVisibility: ColumnVisibility[];
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
  onColumnOrderChange: (columnId: string, direction: 'up' | 'down') => void;
}

export const InventoryFilterSection: React.FC<InventoryFilterSectionProps> = ({
  searchQuery,
  setSearchQuery,
  stockFilter,
  setStockFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  columnVisibility,
  onColumnVisibilityChange,
  onColumnOrderChange
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <ProductFilterControls 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        stockFilter={stockFilter} 
        setStockFilter={setStockFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      
      <div className="flex items-center gap-2">
        <ColumnVisibilityDropdown 
          columns={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
          onColumnOrderChange={onColumnOrderChange}
        />
        
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[180px] bg-[#121212] border-[#272727] text-gray-300">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent className="bg-[#161616] border-[#272727]">
            <SelectItem value="oldest" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Plus ancien d'abord</SelectItem>
            <SelectItem value="newest" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Plus récent d'abord</SelectItem>
            <SelectItem value="low-stock" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Stock bas d'abord</SelectItem>
            <SelectItem value="high-stock" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Stock élevé d'abord</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
