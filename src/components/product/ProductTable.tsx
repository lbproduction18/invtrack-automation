
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
import { StockStatusBadge } from '@/components/product/StockStatusBadge';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  filteredProducts: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  filteredProducts
}) => {
  
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="h-24 text-center">
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
        <TableCell colSpan={5} className="h-24 text-center">
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
        <TableRow key={product.id} className="bg-transparent hover:bg-muted/30">
          <TableCell className="font-medium">{product.SKU}</TableCell>
          <TableCell className="text-right font-medium">{product.current_stock}</TableCell>
          <TableCell className="text-right font-medium">{product.threshold}</TableCell>
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
