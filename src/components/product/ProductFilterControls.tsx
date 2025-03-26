
import React from 'react';
import { Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stockFilter: string;
  setStockFilter: (filter: string) => void;
  priorityFilter: boolean;
  setPriorityFilter: (priority: boolean) => void;
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
      <div className="flex gap-2 items-center">
        <Button
          variant={stockFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStockFilter('all')}
          className={stockFilter === 'all' ? 'bg-primary/90 hover:bg-primary/80' : 'bg-background/50'}
        >
          Tous
        </Button>
        <Button
          variant={stockFilter === 'normal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStockFilter('normal')}
          className={stockFilter === 'normal' ? 'bg-success/20 hover:bg-success/30 text-success-foreground border-success/30' : 'bg-background/50'}
        >
          Normal
        </Button>
        <Button
          variant={stockFilter === 'low' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStockFilter('low')}
          className={stockFilter === 'low' ? 'bg-warning/20 hover:bg-warning/30 text-warning-foreground border-warning/30' : 'bg-background/50'}
        >
          Stock Bas
        </Button>
        <Button
          variant={stockFilter === 'out' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStockFilter('out')}
          className={stockFilter === 'out' ? 'bg-danger/20 hover:bg-danger/30 text-danger-foreground border-danger/30' : 'bg-background/50'}
        >
          Rupture
        </Button>
        
        <Button
          variant={priorityFilter ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPriorityFilter(!priorityFilter)}
          className={priorityFilter ? 'bg-warning/20 hover:bg-warning/30 text-warning-foreground border-warning/30 ml-2' : 'bg-background/50 ml-2'}
        >
          <Star className={priorityFilter ? "mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" : "mr-2 h-4 w-4"} />
          Prioritaires
        </Button>
      </div>
    </div>
  );
};
