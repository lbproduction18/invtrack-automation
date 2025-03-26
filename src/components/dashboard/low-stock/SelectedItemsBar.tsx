
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface SelectedItemsBarProps {
  selectedCount: number;
}

export const SelectedItemsBar: React.FC<SelectedItemsBarProps> = ({ selectedCount }) => {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-md p-2 mb-4 flex justify-between items-center">
      <span className="text-sm">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </span>
      <Button size="sm" variant="outline" className="h-8">
        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
        Order Selected
      </Button>
    </div>
  );
};
