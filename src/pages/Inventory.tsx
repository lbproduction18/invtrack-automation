
import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ArrowDown,
  Plus,
  RefreshCw,
  Clock
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductFilter } from '@/components/product/ProductFilter';
import { ProductTable } from '@/components/product/ProductTable';
import { Pagination } from '@/components/product/Pagination';
import { type Product } from '@/types/product';
import { format } from 'date-fns';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const { toast } = useToast();

  // Fetch the last update time from low_stock_last_updated table
  const { data: lastUpdated, isLoading: isLoadingLastUpdated } = useQuery({
    queryKey: ['last-update-time'],
    queryFn: async () => {
      console.log('Fetching last update time from Supabase...');
      try {
        const { data, error } = await supabase
          .from('low_stock_last_updated')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) {
          console.error('Error fetching last update time:', error);
          throw error;
        }
        
        console.log('Last update time fetched:', data);
        return data;
      } catch (err) {
        console.error('Exception when fetching last update time:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: true
  });

  // Fetch products using react-query
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      console.log('Fetching products for inventory from Supabase...');
      try {
        const { data, error } = await supabase
          .from('Low stock product')
          .select(`
            *,
            suppliers:supplier_id (name)
          `)
          .order('name');
          
        if (error) {
          console.error('Error fetching inventory products:', error);
          throw error;
        }
        
        console.log('Inventory products fetched:', data);
        
        // Transform data to include supplier name
        return data.map((product: any) => ({
          ...product,
          supplier_name: product.suppliers?.name || 'Fournisseur inconnu'
        }));
      } catch (err) {
        console.error('Exception when fetching inventory products:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (error) {
      console.error('Error in inventory products query:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'inventaire. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Format the last update time in a human-readable format
  const formatLastUpdated = () => {
    if (isLoadingLastUpdated || !lastUpdated) return "Chargement...";
    
    try {
      const date = new Date(lastUpdated.updated_at);
      return `${format(date, 'dd MMMM yyyy')} à ${format(date, 'HH:mm')}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return "Date inconnue";
    }
  };

  // Filtrer les produits en fonction de la recherche et du filtre de stock
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Low Stock</h1>
          <p className="text-sm text-muted-foreground">
            Surveiller les produits à faible stock
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <ArrowDown className="mr-2 h-3 w-3" />
            Exporter
          </Button>
          <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-3 w-3" />
            Nouveau Produit
          </Button>
        </div>
      </div>

      {/* Last Updated Section */}
      <Alert className="bg-blue-50/30 border-blue-200 backdrop-blur-sm">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm">
          <span className="font-medium">Dernière mise à jour automatique:</span> {formatLastUpdated()}
          <div className="mt-1 text-xs text-muted-foreground">
            Les données sont automatiquement mises à jour chaque jour à 04:00
          </div>
        </AlertDescription>
      </Alert>

      <Card className="border border-border/30 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader className="px-4 py-3 border-b border-border/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm font-medium">Produits à Faible Stock</CardTitle>
              <CardDescription className="text-xs">
                Surveillez et gérez les produits qui nécessitent un réapprovisionnement
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <ProductFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
          />
          
          <div className="rounded-md border border-border/30 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="hover:bg-transparent border-b border-border/30">
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
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {filteredProducts.length} résultats
            </div>
            <Pagination 
              filteredCount={filteredProducts.length}
              totalCount={products.length}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
