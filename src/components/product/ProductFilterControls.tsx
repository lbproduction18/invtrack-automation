
import React from 'react';
import { Search, Flag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stockFilter: string;
  setStockFilter: (filter: string) => void;
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
}

export const ProductFilterControls: React.FC<ProductFilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  stockFilter,
  setStockFilter,
  priorityFilter,
  setPriorityFilter
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
      <div className="flex items-center gap-2">
        <Select
          value={priorityFilter}
          onValueChange={setPriorityFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les priorités</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="moyen">Moyen</SelectItem>
            <SelectItem value="prioritaire">Prioritaire</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
