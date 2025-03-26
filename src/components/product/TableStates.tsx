
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Loader2, Package } from 'lucide-react';

interface EmptyStateProps {
  colSpan: number;
}

export const LoadingState: React.FC<EmptyStateProps> = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground font-medium">Chargement des produits...</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const EmptyState: React.FC<EmptyStateProps> = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <Package className="h-8 w-8 mb-2 opacity-50" />
          <p className="font-medium">Aucun produit trouvé</p>
          <p className="text-sm">Essayez d'ajuster votre recherche ou vos filtres, ou ajoutez des produits à la base de données</p>
        </div>
      </TableCell>
    </TableRow>
  );
};
