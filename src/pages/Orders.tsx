import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Plus, 
  ArrowDown, 
  MoreHorizontal,
  Calendar,
  Truck
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
import { Badge } from '@/components/ui/badge';
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
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

// Définition du type pour les données des commandes
type Order = {
  id: string;
  order_id: string;
  date: string;
  supplier_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  supplier_name?: string;
  items_count?: number;
  total_amount?: number;
};

// Fonction formatant la date en format plus lisible
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Composant pour afficher le badge de statut
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusStyles: Record<string, string> = {
    'pending': 'border-warning/50 text-warning bg-warning/10',
    'processing': 'border-info/50 text-info bg-info/10',
    'shipped': 'border-primary/50 text-primary bg-primary/10',
    'delivered': 'border-success/50 text-success bg-success/10',
    'cancelled': 'border-danger/50 text-danger bg-danger/10',
    'completed': 'border-success/50 text-success bg-success/10',
    'partial': 'border-info/50 text-info bg-info/10'
  };
  
  const displayNames: Record<string, string> = {
    'pending': 'En attente',
    'processing': 'En cours',
    'shipped': 'Expédié',
    'delivered': 'Livré',
    'cancelled': 'Annulé',
    'completed': 'Terminé',
    'partial': 'Partiel'
  };
  
  return (
    <Badge 
      variant="outline" 
      className={statusStyles[status] || 'border-muted/50 text-muted bg-muted/10'}
    >
      {displayNames[status] || status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  // Fetch orders using react-query with mock data
  const { data: orders = [], isLoading: loading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      console.log('Fetching orders (mock data)...');
      
      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: '1',
          order_id: 'ORD-2023-001',
          date: '2023-05-15',
          supplier_id: 'SUP001',
          supplier_name: 'Fournisseur Principal',
          status: 'delivered',
          created_at: '2023-05-15T10:00:00',
          updated_at: '2023-05-15T10:00:00',
          items_count: 15,
          total_amount: 3250
        },
        {
          id: '2',
          order_id: 'ORD-2023-002',
          date: '2023-06-22',
          supplier_id: 'SUP002',
          supplier_name: 'Fournisseur Secondaire',
          status: 'processing',
          created_at: '2023-06-22T14:30:00',
          updated_at: '2023-06-22T14:30:00',
          items_count: 8,
          total_amount: 1750
        },
        {
          id: '3',
          order_id: 'ORD-2023-003',
          date: '2023-07-10',
          supplier_id: 'SUP001',
          supplier_name: 'Fournisseur Principal',
          status: 'pending',
          created_at: '2023-07-10T09:15:00',
          updated_at: '2023-07-10T09:15:00',
          items_count: 22,
          total_amount: 4800
        }
      ];
      
      return mockOrders;
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (error) {
      console.error('Error in orders query:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Filtrer les commandes en fonction de la recherche et du filtre de statut
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      searchQuery === '' || 
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">
            Gérez vos commandes fournisseurs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <ArrowDown className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Commande
          </Button>
        </div>
      </div>

      <Card className="card-glass">
        <CardHeader className="px-6">
          <CardTitle>Liste des Commandes</CardTitle>
          <CardDescription>
            Consultez et gérez toutes vos commandes fournisseurs
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par ID commande ou fournisseur..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="shipped">Expédié</SelectItem>
                  <SelectItem value="delivered">Livré</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
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
                  <TableHead>Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead className="text-right">Articles</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Chargement des commandes...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <ShoppingCart className="h-8 w-8 mb-2 opacity-50" />
                        <p>Aucune commande trouvée</p>
                        <p className="text-sm">Essayez d'ajuster votre recherche ou vos filtres</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="table-row-glass">
                      <TableCell className="font-medium">{order.order_id}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{order.supplier_name}</TableCell>
                      <TableCell className="text-right">{order.items_count}</TableCell>
                      <TableCell className="text-right">{order.total_amount} $ CAD</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={order.status} />
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
                              <Calendar className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Mettre à jour statut
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-danger">Annuler commande</DropdownMenuItem>
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
              Affichage de {filteredOrders.length} sur {orders.length} commandes
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={loading || orders.length === 0}>
                Précédent
              </Button>
              <Button variant="outline" size="sm" className="bg-primary/10">
                1
              </Button>
              <Button variant="outline" size="sm" disabled={loading || orders.length === 0}>
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
