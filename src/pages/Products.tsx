
import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowDown
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Type pour les produits
type Product = {
  id: string;
  product_id: string;
  name: string;
  description: string;
  unit: string;
  current_stock: number;
  threshold: number;
  avg_sales: number;
  lead_time: number;
  supplier_id: string;
  supplier_name?: string;
  created_at: string;
  updated_at: string;
};

// Composant pour afficher le statut du stock
const StockStatusBadge: React.FC<{ stock: number; threshold: number }> = ({ stock, threshold }) => {
  if (stock <= 0) {
    return (
      <Badge variant="outline" className="border-danger/50 text-danger bg-danger/10">
        Rupture
      </Badge>
    );
  } else if (stock <= threshold) {
    return (
      <Badge variant="outline" className="border-warning/50 text-warning bg-warning/10">
        Bas
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="border-success/50 text-success bg-success/10">
        Normal
      </Badge>
    );
  }
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const { toast } = useToast();

  // Récupération des produits depuis Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Requête pour obtenir les produits avec le nom du fournisseur
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            suppliers:supplier_id (name)
          `)
          .order('name');
        
        if (error) {
          throw error;
        }
        
        // Transformation des données pour inclure les informations du fournisseur
        const productsWithSuppliers = data.map((product: any) => ({
          ...product,
          supplier_name: product.suppliers?.name || 'Fournisseur inconnu'
        }));
        
        setProducts(productsWithSuppliers);
        
        console.log('Products fetched:', productsWithSuppliers);
      } catch (error: any) {
        console.error('Erreur lors de la récupération des produits:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  // Filtrer les produits en fonction de la recherche et du filtre de stock
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (stockFilter === 'all') {
      return matchesSearch;
    } else if (stockFilter === 'low') {
      return matchesSearch && product.current_stock <= product.threshold;
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
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <ArrowDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Produit
          </Button>
        </div>
      </div>

      <Card className="card-glass">
        <CardHeader className="px-6">
          <CardTitle>Catalogue de Produits</CardTitle>
          <CardDescription>
            Consultez et gérez tous vos produits
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, ID ou fournisseur..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="low">Stock bas</SelectItem>
                  <SelectItem value="out">En rupture</SelectItem>
                  <SelectItem value="normal">Stock normal</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Produit</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead className="text-right">Stock Actuel</TableHead>
                  <TableHead className="text-right">Seuil</TableHead>
                  <TableHead className="text-right">Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Chargement des produits...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8 mb-2 opacity-50" />
                        <p>Aucun produit trouvé</p>
                        <p className="text-sm">Essayez d'ajuster votre recherche ou vos filtres</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="table-row-glass">
                      <TableCell className="font-medium">{product.product_id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>{product.supplier_name}</TableCell>
                      <TableCell className="text-right">{product.current_stock}</TableCell>
                      <TableCell className="text-right">{product.threshold}</TableCell>
                      <TableCell className="text-right">
                        <StockStatusBadge stock={product.current_stock} threshold={product.threshold} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Ajuster le stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-danger">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {filteredProducts.length} sur {products.length} produits
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={loading || products.length === 0}>
                Précédent
              </Button>
              <Button variant="outline" size="sm" className="bg-primary/10">
                1
              </Button>
              <Button variant="outline" size="sm" disabled={loading || products.length === 0}>
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
