
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  filteredCount: number;
  totalCount: number;
  isLoading: boolean;
  currentPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  filteredCount,
  totalCount,
  isLoading,
  currentPage = 1
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Affichage de {filteredCount} sur {totalCount} produits
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={isLoading || totalCount === 0 || currentPage <= 1}>
          Précédent
        </Button>
        <Button variant="outline" size="sm" className="bg-primary/10">
          {currentPage}
        </Button>
        <Button variant="outline" size="sm" disabled={isLoading || totalCount === 0}>
          Suivant
        </Button>
      </div>
    </div>
  );
};
