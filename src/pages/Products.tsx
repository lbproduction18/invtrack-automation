
import React, { useEffect, useState } from 'react';
import { 
  Package, 
  ArrowDown,
  Plus,
  Search
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductTable } from '@/components/product/ProductTable';
import { Pagination } from '@/components/product/Pagination';
import { type Product } from '@/types/product';

const Products: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const { toast } = useToast();

  // Fetch products using react-query
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      try {
        const { data, error } = await supabase
          .from('Low stock product')
          .select(`
            *,
            suppliers:supplier_id (name)
          `)
          .order('name');
          
        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
        
        console.log('Products fetched:', data);
        
        // Transform data to include supplier name
        return data.map((product: any) => ({
          ...product,
          supplier_name: product.suppliers?.name || 'Fournisseur inconnu'
        }));
      } catch (err) {
        console.error('Exception when fetching products:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (error) {
      console.error('Error in products query:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Filtrer les produits en fonction de la recherche et du filtre de stock
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.SKU.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (stockFilter === 'all') {
      return matchesSearch;
    } else if (stockFilter === 'low') {
      return matchesSearch && product.current_stock <= product.threshold && product.current_stock > 0;
    } else if (stockFilter === 'out') {
      return matchesSearch && product.current_stock <= 0;
    } else if (stockFilter === 'normal') {
      return matchesSearch && product.current_stock > product.threshold;
    }
    
    return matchesSearch;
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
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-background/50 border-input w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={stockFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('all')}
                className={stockFilter === 'all' ? 'bg-primary/90 hover:bg-primary/80' : 'bg-background/50'}
              >
                Tous
              </Button>
              <Button
                variant={stockFilter === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('normal')}
                className={stockFilter === 'normal' ? 'bg-success/20 hover:bg-success/30 text-success-foreground border-success/30' : 'bg-background/50'}
              >
                Normal
              </Button>
              <Button
                variant={stockFilter === 'low' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('low')}
                className={stockFilter === 'low' ? 'bg-warning/20 hover:bg-warning/30 text-warning-foreground border-warning/30' : 'bg-background/50'}
              >
                Stock Bas
              </Button>
              <Button
                variant={stockFilter === 'out' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('out')}
                className={stockFilter === 'out' ? 'bg-danger/20 hover:bg-danger/30 text-danger-foreground border-danger/30' : 'bg-background/50'}
              >
                Rupture
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="text-xs font-medium">ID Produit</TableHead>
                  <TableHead className="text-xs font-medium">Nom</TableHead>
                  <TableHead className="text-xs font-medium">Unité</TableHead>
                  <TableHead className="text-xs font-medium">Fournisseur</TableHead>
                  <TableHead className="text-xs font-medium text-right">Stock Actuel</TableHead>
                  <TableHead className="text-xs font-medium text-right">Seuil</TableHead>
                  <TableHead className="text-xs font-medium text-right">Statut</TableHead>
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
