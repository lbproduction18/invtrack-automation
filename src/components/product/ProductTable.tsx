
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
import { Loader2, MoreHorizontal, Package, Pencil, Plus, Trash2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { type Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
    return "bg-success text-success-foreground"; // Vert pour moins d'une semaine
  } else if (days < 14) {
    return "bg-warning text-warning-foreground"; // Orange pour 1-2 semaines
  } else {
    return "bg-danger text-danger-foreground"; // Rouge pour plus de 2 semaines
  }
};

// Fonction pour déterminer l'icône selon le nombre de jours
const getAgingIcon = (days: number) => {
  if (days < 7) {
    return <Clock className="h-3.5 w-3.5" />; // Icône d'horloge pour les articles récents
  } else if (days < 14) {
    return <AlertTriangle className="h-3.5 w-3.5" />; // Icône d'alerte pour les articles vieillissants
  } else {
    return <AlertCircle className="h-3.5 w-3.5" />; // Icône d'alerte critique pour les articles anciens
  }
};

// Fonction pour déterminer le label selon le nombre de jours
const getAgingLabel = (days: number): string => {
  if (days < 7) {
    return "Récent"; // Pour moins d'une semaine
  } else if (days < 14) {
    return "Vieillissant"; // Pour 1-2 semaines
  } else {
    return "Ancien"; // Pour plus de 2 semaines
  }
};

// Fonction pour déterminer le pourcentage pour la barre de progression
const getAgingPercentage = (days: number): number => {
  if (days < 21) {
    return Math.min(days * 5, 100); // 5% par jour, max 100%
  }
  return 100;
};

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
      {filteredProducts.map((product) => {
        const daysSinceAdded = getDaysSinceAdded(product.created_at);
        const agingColor = getAgingColor(daysSinceAdded);
        const agingIcon = getAgingIcon(daysSinceAdded);
        const agingLabel = getAgingLabel(daysSinceAdded);
        const agingPercentage = getAgingPercentage(daysSinceAdded);
        
        return (
          <TableRow key={product.id} className="bg-transparent hover:bg-muted/30">
            <TableCell className="font-medium">{product.SKU}</TableCell>
            <TableCell>
              {new Date(product.created_at).toLocaleDateString('fr-FR', {
                month: 'short',
                day: 'numeric'
              })}
            </TableCell>
            <TableCell className="text-right font-medium w-24">{product.current_stock}</TableCell>
            <TableCell className="text-right font-medium w-24">{product.threshold}</TableCell>
            <TableCell className="py-1.5">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={cn("flex items-center gap-1 px-2 py-0.5", agingColor)}>
                    {agingIcon}
                    <span className="text-xs">{agingLabel}</span>
                  </Badge>
                  <span className="text-xs font-medium">{daysSinceAdded} jours</span>
                </div>
                <Progress 
                  value={agingPercentage} 
                  className="h-1 w-full" 
                  indicatorClassName={cn(
                    "h-full transition-all", 
                    daysSinceAdded < 7 ? "bg-success" : 
                    daysSinceAdded < 14 ? "bg-warning" : "bg-danger"
                  )} 
                />
              </div>
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
        );
      })}
    </>
  );
};

