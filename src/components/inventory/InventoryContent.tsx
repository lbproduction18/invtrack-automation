
import React, { useState } from 'react';
import { AlertTriangle, ArrowDownAZ, MoreHorizontal } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CardContent } from '@/components/ui/card';
import { ProductTable } from '@/components/product/ProductTable';
import { ProductFilterControls } from '@/components/product/ProductFilterControls';
import { FilteredProductsList, type SortOption } from '@/components/product/FilteredProductsList';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const InventoryContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('oldest');
  const { products, isLoading } = useProducts();
  
  const filteredProducts = FilteredProductsList({ 
    products, 
    searchQuery, 
    stockFilter,
    sortBy
  });

  return (
    <CardContent className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductFilterControls 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          stockFilter={stockFilter} 
          setStockFilter={setStockFilter} 
        />
        
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px] bg-[#121212] border-[#272727] text-gray-300">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-[#161616] border-[#272727]">
              <SelectItem value="oldest" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Plus ancien d'abord</SelectItem>
              <SelectItem value="newest" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Plus récent d'abord</SelectItem>
              <SelectItem value="low-stock" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Stock bas d'abord</SelectItem>
              <SelectItem value="high-stock" className="text-gray-300 hover:bg-[#272727] focus:bg-[#272727]">Stock élevé d'abord</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border border-[#272727] overflow-hidden mt-4">
        <Table>
          <TableHeader className="bg-[#161616]">
            <TableRow className="hover:bg-transparent border-b border-[#272727]">
              <TableHead className="text-xs font-medium text-gray-400">SKU</TableHead>
              <TableHead className="text-xs font-medium text-gray-400">Date Ajoutée</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-right w-24">Stock Actuel</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-right w-24">Seuil</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-right w-24">Âge</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`} className="border-b border-[#272727] hover:bg-[#161616]">
                  <TableCell colSpan={6} className="h-12 animate-pulse bg-[#161616]/50"></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow className="hover:bg-[#161616]">
                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
                    <p>Aucun produit trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <ProductTable 
                products={products} 
                isLoading={isLoading} 
                filteredProducts={filteredProducts} 
              />
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {filteredProducts.length} résultats
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
    </CardContent>
  );
};
