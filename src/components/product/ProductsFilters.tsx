
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

interface ProductsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stockFilter: string;
  setStockFilter: (filter: string) => void;
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
  columnVisibility: ColumnVisibility[];
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
  onColumnOrderChange: (columnId: string, direction: 'up' | 'down') => void;
}

export const ProductsFilters: React.FC<ProductsFiltersProps> = ({
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
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
