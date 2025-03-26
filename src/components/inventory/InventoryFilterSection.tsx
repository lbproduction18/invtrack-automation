
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
import { ArrowUpDown } from 'lucide-react';

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
    <div className="flex flex-col gap-4">
      <ProductFilterControls 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        stockFilter={stockFilter} 
        setStockFilter={setStockFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ColumnVisibilityDropdown 
            columns={columnVisibility}
            onColumnVisibilityChange={onColumnVisibilityChange}
            onColumnOrderChange={onColumnOrderChange}
          />
        </div>
        
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[200px] bg-background border-input">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Trier par" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-popover border-input">
            <SelectItem value="oldest">Plus ancien d'abord</SelectItem>
            <SelectItem value="newest">Plus récent d'abord</SelectItem>
            <SelectItem value="low-stock">Stock bas d'abord</SelectItem>
            <SelectItem value="high-stock">Stock élevé d'abord</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
