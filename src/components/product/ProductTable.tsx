
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
import { Loader2, MoreHorizontal, Package, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { type Product } from '@/types/product';
import { StockStatusBadge } from '@/components/product/StockStatusBadge';
import { cn } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
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

// Fonction pour détecter si un produit est prioritaire
const isPriorityProduct = (threshold: number): boolean => {
  return threshold > 5; // Seuil de priorité
};

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  filteredProducts
}) => {
  
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Chargement des produits...</p>
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
            <p>Aucun produit trouvé</p>
            <p className="text-sm">Essayez d'ajuster votre recherche ou vos filtres, ou ajoutez des produits à la base de données</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {filteredProducts.map((product) => (
        <TableRow key={product.id} className={cn(
          "bg-transparent hover:bg-muted/30",
          isPriorityProduct(product.threshold) && "bg-warning/5" // Légère surbrillance pour les produits prioritaires
        )}>
          <TableCell className="font-medium">
            <div className="flex items-center">
              {isPriorityProduct(product.threshold) && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
              )}
              {product.SKU}
            </div>
          </TableCell>
          <TableCell>
            {new Date(product.created_at).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </TableCell>
          <TableCell className="text-right">
            <StockStatusBadge stock={product.current_stock} threshold={product.threshold} />
          </TableCell>
          <TableCell className="text-right font-medium w-24">{product.current_stock}</TableCell>
          <TableCell className="text-right font-medium w-24">{product.threshold}</TableCell>
          <TableCell className={cn("text-right w-24", getAgingColor(getDaysSinceAdded(product.created_at)))}>
            {getDaysSinceAdded(product.created_at)} jours
          </TableCell>
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
