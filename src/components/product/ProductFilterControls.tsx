
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
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher par SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 bg-background/50 border-input w-full h-10"
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={priorityFilter}
          onValueChange={setPriorityFilter}
        >
          <SelectTrigger className="min-w-[180px] h-10 bg-background border-input">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrer par priorité" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-popover border-input">
            <SelectItem value="all">Toutes les priorités</SelectItem>
            <SelectItem value="standard" className="text-slate-500">Standard</SelectItem>
            <SelectItem value="moyen" className="text-orange-500 font-medium">Moyen</SelectItem>
            <SelectItem value="prioritaire" className="text-red-600 font-semibold">Prioritaire</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={stockFilter}
          onValueChange={setStockFilter}
        >
          <SelectTrigger className="min-w-[180px] h-10 bg-background border-input">
            <SelectValue placeholder="Filtrer par stock" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-input">
            <SelectItem value="all">Tous les stocks</SelectItem>
            <SelectItem value="out" className="text-red-600 font-medium">En rupture</SelectItem>
            <SelectItem value="low" className="text-amber-500 font-medium">Stock bas</SelectItem>
            <SelectItem value="normal" className="text-green-600 font-medium">Stock normal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
