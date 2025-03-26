
import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ArrowDown,
  Plus,
  RefreshCw,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  Download
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-medium text-white tracking-tight">Low Stock</h1>
          <p className="text-sm text-gray-400">
            Produits nécessitant un réapprovisionnement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs border-[#2E2E2E] bg-[#121212] text-gray-300 hover:bg-[#1E1E1E] hover:border-[#3ECF8E] hover:text-white"
          >
            <Download className="mr-2 h-3 w-3" />
            Exporter
          </Button>
          <Button 
            size="sm" 
            className="h-8 text-xs bg-[#3ECF8E] hover:bg-[#2DBC7F] text-white"
          >
            <Plus className="mr-2 h-3 w-3" />
            Nouveau Produit
          </Button>
        </div>
      </div>

      {/* Last Updated Section */}
      <Alert className="bg-[#121212]/60 border-[#272727] backdrop-blur-sm">
        <Clock className="h-4 w-4 text-[#3ECF8E]" />
        <AlertDescription className="text-sm text-gray-300">
          <span className="font-medium text-white">Dernière mise à jour automatique:</span> {formatLastUpdated()}
          <div className="mt-1 text-xs text-gray-400">
            Les données sont automatiquement mises à jour chaque jour à 04:00
          </div>
        </AlertDescription>
      </Alert>

      <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="px-4 py-3 border-b border-[#272727]">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm font-medium text-white">Produits à Faible Stock</CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Surveillez et gérez les produits qui nécessitent un réapprovisionnement
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-[#2E2E2E] bg-[#0F0F0F] py-2 pl-8 pr-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3ECF8E] text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={stockFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('all')}
                className={stockFilter === 'all' 
                  ? 'bg-[#3ECF8E] hover:bg-[#2DBC7F] text-white' 
                  : 'bg-[#121212] border-[#272727] text-gray-300 hover:border-[#3ECF8E] hover:text-white'}
              >
                Tous
              </Button>
              <Button
                variant={stockFilter === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('normal')}
                className={stockFilter === 'normal' 
                  ? 'bg-green-900/30 hover:bg-green-900/50 text-green-400 border-green-900' 
                  : 'bg-[#121212] border-[#272727] text-gray-300 hover:border-[#3ECF8E] hover:text-white'}
              >
                Normal
              </Button>
              <Button
                variant={stockFilter === 'low' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('low')}
                className={stockFilter === 'low' 
                  ? 'bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 border-yellow-900' 
                  : 'bg-[#121212] border-[#272727] text-gray-300 hover:border-[#3ECF8E] hover:text-white'}
              >
                Stock Bas
              </Button>
              <Button
                variant={stockFilter === 'out' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStockFilter('out')}
                className={stockFilter === 'out' 
                  ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-900' 
                  : 'bg-[#121212] border-[#272727] text-gray-300 hover:border-[#3ECF8E] hover:text-white'}
              >
                Rupture
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border border-[#272727] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#161616]">
                <TableRow className="hover:bg-transparent border-b border-[#272727]">
                  <TableHead className="text-xs font-medium text-gray-400">ID Produit</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400">Nom</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400">Unité</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400">Fournisseur</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-right">Stock Actuel</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-right">Seuil</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-right">Statut</TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`} className="border-b border-[#272727] hover:bg-[#161616]">
                      <TableCell colSpan={8} className="h-12 animate-pulse bg-[#161616]/50"></TableCell>
                    </TableRow>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <TableRow className="hover:bg-[#161616]">
                    <TableCell colSpan={8} className="h-24 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
                        <p>Aucun produit trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-[#272727] hover:bg-[#161616] text-white">
                      <TableCell className="font-mono text-xs text-gray-300">{product.product_id}</TableCell>
                      <TableCell className="font-medium text-white">{product.name}</TableCell>
                      <TableCell className="text-gray-300">{product.unit}</TableCell>
                      <TableCell className="text-gray-300">{product.supplier_name}</TableCell>
                      <TableCell className="text-right font-medium text-white">{product.current_stock}</TableCell>
                      <TableCell className="text-right text-gray-300">{product.threshold}</TableCell>
                      <TableCell className="text-right">
                        {product.current_stock <= 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400">
                            Rupture
                          </span>
                        ) : product.current_stock <= product.threshold ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">
                            Stock Bas
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                            Normal
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#272727]">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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
      </Card>
    </div>
  );
};

export default Inventory;
