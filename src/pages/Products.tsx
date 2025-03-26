import React, { useState } from 'react';
import { 
  Package, 
  ArrowDown,
  Plus
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilterControls } from '@/components/product/ProductFilterControls';
import { ProductTable } from '@/components/product/ProductTable';
import { Pagination } from '@/components/product/Pagination';
import { FilteredProductsList } from '@/components/product/FilteredProductsList';

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  const { products, isLoading } = useProducts();
  
  const filteredProducts = FilteredProductsList({
    products,
    searchQuery,
    stockFilter
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="bg-background hover:bg-muted border-border"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button 
            className="bg-primary text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        </div>
      </div>

      <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-xl font-medium">Catalogue de Produits</CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          <ProductFilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
          />
          
          <div className="rounded-md border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="text-xs font-medium">SKU</TableHead>
                  <TableHead className="text-xs font-medium">Date Ajoutée</TableHead>
                  <TableHead className="text-xs font-medium text-right">Statut</TableHead>
                  <TableHead className="text-xs font-medium text-right w-24">Stock Actuel</TableHead>
                  <TableHead className="text-xs font-medium text-right w-24">Seuil</TableHead>
                  <TableHead className="text-xs font-medium text-right w-24">Âge</TableHead>
                  <TableHead className="text-xs font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ProductTable 
                  products={products}
                  isLoading={isLoading}
                  filteredProducts={filteredProducts}
                />
              </TableBody>
            </Table>
          </div>
          
          <Pagination 
            filteredCount={filteredProducts.length}
            totalCount={products.length}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
