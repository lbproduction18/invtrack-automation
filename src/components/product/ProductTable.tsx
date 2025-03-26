
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal, Package, Pencil, Plus, Trash2 } from 'lucide-react';
import { type Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { ColumnVisibilityDropdown, type ColumnVisibility } from './ColumnVisibilityDropdown';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
  columnVisibility: ColumnVisibility[];
}

// Fonction pour calculer le nombre de jours écoulés depuis une date
const getDaysSinceAdded = (createdDate: string): number => {
  const created = new Date(createdDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Fonction pour déterminer la couleur selon le nombre de jours
const getAgingColor = (days: number): string => {
  if (days < 7) {
    return "text-success font-medium"; // Vert pour moins d'une semaine
  } else if (days < 14) {
    return "text-warning font-medium"; // Orange pour 1-2 semaines
  } else {
    return "text-danger font-medium"; // Rouge pour plus de 2 semaines
  }
};

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  filteredProducts,
  columnVisibility
}) => {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground font-medium">Chargement des produits...</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Package className="h-8 w-8 mb-2 opacity-50" />
            <p className="font-medium">Aucun produit trouvé</p>
            <p className="text-sm">Essayez d'ajuster votre recherche ou vos filtres, ou ajoutez des produits à la base de données</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  // Trier les colonnes par ordre
  const sortedColumns = [...columnVisibility].sort((a, b) => a.order - b.order);

  return (
    <>
      {filteredProducts.map((product) => (
        <TableRow key={product.id} className="bg-transparent hover:bg-muted/30">
          {sortedColumns.map(column => {
            if (!column.isVisible) return null;
            
            switch(column.id) {
              case 'SKU':
                return (
                  <TableCell key={`${product.id}-${column.id}`} className="font-medium">
                    {product.SKU}
                  </TableCell>
                );
              case 'date':
                return (
                  <TableCell key={`${product.id}-${column.id}`}>
                    {new Date(product.created_at).toLocaleDateString('fr-FR', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                );
              case 'stock':
                return (
                  <TableCell key={`${product.id}-${column.id}`} className="text-right font-medium w-24">
                    {product.current_stock}
                  </TableCell>
                );
              case 'threshold':
                return (
                  <TableCell key={`${product.id}-${column.id}`} className="text-right font-medium w-24">
                    {product.threshold}
                  </TableCell>
                );
              case 'age':
                return (
                  <TableCell 
                    key={`${product.id}-${column.id}`} 
                    className={cn("text-right w-24", getAgingColor(getDaysSinceAdded(product.created_at)))}
                  >
                    {getDaysSinceAdded(product.created_at)} jours
                  </TableCell>
                );
              default:
                return null;
            }
          })}
          
          <TableCell className="text-right">
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
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
