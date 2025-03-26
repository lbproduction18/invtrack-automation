
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProductFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stockFilter: string;
  setStockFilter: (filter: string) => void;
}

export const ProductFilterControls: React.FC<ProductFilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  stockFilter,
  setStockFilter
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 bg-background/50 border-input w-full"
        />
      </div>
    </div>
  );
};
