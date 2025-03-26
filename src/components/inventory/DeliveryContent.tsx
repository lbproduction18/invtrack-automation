
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, Truck, Clock, AlertTriangle, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from "@/components/ui/progress";

export const DeliveryContent: React.FC = () => {
  // Données d'exemple pour les livraisons
  const deliveryItems = [
    { 
      id: 1, 
      sku: 'SKU-001', 
      name: 'Produit A',
      orderDate: '2025-03-01',
      eta: '2025-03-20',
      quantity: 15,
      received: 0,
      status: 'transit',
      trackingNo: 'TRK-12345',
      notes: 'En transit - Arrivée prévue dans 5 jours'
    },
    { 
      id: 2, 
      sku: 'SKU-002', 
      name: 'Produit B',
      orderDate: '2025-03-01',
      eta: '2025-03-15',
      quantity: 25,
      received: 15,
      status: 'partial',
      trackingNo: 'TRK-67890',
      notes: 'Livraison partielle reçue le 12/03'
    },
    { 
      id: 3, 
      sku: 'SKU-003', 
      name: 'Produit C',
      orderDate: '2025-03-01',
      eta: '2025-03-10',
      quantity: 10,
      received: 10,
      status: 'complete',
      trackingNo: 'TRK-54321',
      notes: 'Livraison complète reçue le 09/03'
    },
  ];

  // Historique des entrées en stock
  const stockHistory = [
    { 
      id: 1, 
      date: '2025-03-09', 
      sku: 'SKU-003',
      name: 'Produit C',
      quantity: 10, 
      recipient: 'Alice Martin',
      notes: 'Bon état, conforme à la commande'
    },
    { 
      id: 2, 
      date: '2025-03-12',
      sku: 'SKU-002',
      name: 'Produit B',
      quantity: 15, 
      recipient: 'Thomas Dupont',
      notes: 'Livraison partielle, reste à venir'
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'transit':
        return <Badge variant="outline" className="flex items-center gap-1 bg-blue-900/20 text-blue-400 border-blue-800">
                <Truck className="h-3 w-3" />En transit
               </Badge>;
      case 'partial':
        return <Badge variant="outline" className="flex items-center gap-1 bg-yellow-900/20 text-yellow-400 border-yellow-800">
                <Package className="h-3 w-3" />Partielle
               </Badge>;
      case 'complete':
        return <Badge variant="outline" className="flex items-center gap-1 bg-green-900/20 text-green-400 border-green-800">
                <CheckCircle2 className="h-3 w-3" />Complète
               </Badge>;
      case 'delayed':
        return <Badge variant="outline" className="flex items-center gap-1 bg-red-900/20 text-red-400 border-red-800">
                <AlertTriangle className="h-3 w-3" />Retardée
               </Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <CardContent className="p-4">
      <Tabs defaultValue="current">
        <TabsList className="mb-4">
          <TabsTrigger value="current">Livraisons en cours</TabsTrigger>
          <TabsTrigger value="history">Historique d'entrées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Commande</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Tracking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatDate(item.orderDate)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(item.eta)}</TableCell>
                  <TableCell>{item.received} / {item.quantity}</TableCell>
                  <TableCell>
                    <div className="w-full flex items-center gap-2">
                      <Progress value={(item.received / item.quantity) * 100} className="h-2 w-24" />
                      <span className="text-xs">{Math.round((item.received / item.quantity) * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.trackingNo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="border border-[#272727] rounded-md p-3">
            <h4 className="text-xs font-medium mb-2 flex items-center gap-2">
              <CalendarDays className="h-3 w-3" /> 
              Notes et calendrier de livraison
            </h4>
            <div className="space-y-2">
              {deliveryItems.map((item) => (
                <div key={item.id} className="text-xs p-2 border border-[#272727] rounded bg-[#121212]/40">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.sku} - {item.name}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-muted-foreground mt-1">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Réceptionné par</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(entry.date)}</TableCell>
                  <TableCell>{entry.sku}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.recipient}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{entry.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </CardContent>
  );
};
