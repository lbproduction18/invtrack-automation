
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Flag, Trash2 } from 'lucide-react';
import { PriorityDialog } from './PriorityDialog';
import { type Product } from '@/types/product';

interface ProductRowActionsProps {
  product: Product;
  onPriorityChange: (productId: string, newPriority: 'standard' | 'moyen' | 'prioritaire' | 'important') => void;
}

export const ProductRowActions: React.FC<ProductRowActionsProps> = ({ 
  product, 
  onPriorityChange 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm border-border/40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Priorité</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <PriorityDialog
          productId={product.id}
          currentPriority={product.priority_badge}
          onPriorityChange={(newPriority) => onPriorityChange(product.id, newPriority)}
        >
          <DropdownMenuItem>
            <Flag className="mr-2 h-4 w-4" />
            Changer la priorité
          </DropdownMenuItem>
        </PriorityDialog>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
