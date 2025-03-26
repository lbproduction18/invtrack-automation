
import React from 'react';
import { Button } from '@/components/ui/button';

interface InventoryPaginationProps {
  isLoading: boolean;
  filteredProductsCount: number;
}

export const InventoryPagination: React.FC<InventoryPaginationProps> = ({
  isLoading,
  filteredProductsCount
}) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-xs text-gray-400">
        {filteredProductsCount} résultats
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="h-7 bg-[#121212] border-[#272727] text-gray-300 hover:border-[#3ECF8E] hover:text-white disabled:opacity-50"
        >
          Précédent
        </Button>
        <div className="text-xs text-gray-400">
          Page <span className="font-medium text-white">1</span> sur <span className="font-medium text-white">1</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="h-7 bg-[#121212] border-[#272727] text-gray-300 hover:border-[#3ECF8E] hover:text-white disabled:opacity-50"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
