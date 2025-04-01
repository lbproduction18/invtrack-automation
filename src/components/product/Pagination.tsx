
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  filteredCount: number;
  totalCount: number;
  isLoading: boolean;
  currentPage?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  filteredCount,
  totalCount,
  isLoading,
  currentPage = 1,
  onPreviousPage,
  onNextPage
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Affichage de {filteredCount} sur {totalCount} produits
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousPage}
          disabled={isLoading || totalCount === 0 || currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Précédent
        </Button>
        <Button variant="outline" size="sm" className="bg-primary/10">
          {currentPage}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextPage}
          disabled={isLoading || totalCount === 0}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
