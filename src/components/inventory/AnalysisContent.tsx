
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpIcon, ArrowDownIcon, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const AnalysisContent: React.FC = () => {
  // Données d'exemple pour l'analyse
  const analysisData = [
    { 
      id: 1, 
      sku: 'SKU-001', 
      name: 'Produit A',
      current: 5, 
      threshold: 10, 
      recommended: 15, 
      trend: 'up', 
      priority: 'high',
      lastSales: 25,
      status: 'pending',
      notes: 'Produit à forte demande saisonnière'
    },
    { 
      id: 2, 
      sku: 'SKU-002', 
      name: 'Produit B',
      current: 8, 
      threshold: 20, 
      recommended: 25, 
      trend: 'down', 
      priority: 'medium',
      lastSales: 12,
      status: 'ordered',
      notes: 'Commande récente en attente de livraison'
    },
    { 
      id: 3, 
      sku: 'SKU-003', 
      name: 'Produit C',
      current: 3, 
      threshold: 8, 
      recommended: 10, 
      trend: 'up', 
      priority: 'high',
      lastSales: 18,
      status: 'pending',
      notes: 'Fournisseur principal en rupture, contacter alternative'
    },
    { 
      id: 4, 
      sku: 'SKU-004', 
      name: 'Produit D',
      current: 15, 
      threshold: 12, 
      recommended: 0, 
      trend: 'down', 
      priority: 'low',
      lastSales: 5,
      status: 'ok',
      notes: 'Stock suffisant pour le moment'
    },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ordered':
        return <Badge variant="outline" className="flex items-center gap-1 bg-blue-900/20 text-blue-400 border-blue-800">
                <Clock className="h-3 w-3" />Déjà commandé
               </Badge>;
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1 bg-yellow-900/20 text-yellow-400 border-yellow-800">
                <AlertTriangle className="h-3 w-3" />À commander
               </Badge>;
      case 'ok':
        return <Badge variant="outline" className="flex items-center gap-1 bg-green-900/20 text-green-400 border-green-800">
                <CheckCircle2 className="h-3 w-3" />Stock OK
               </Badge>;
      default:
        return null;
    }
  };

  return (
    <CardContent className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Stock Actuel</TableHead>
            <TableHead>Seuil</TableHead>
            <TableHead>Recommandé</TableHead>
            <TableHead>Ventes Récentes</TableHead>
            <TableHead>Tendance</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analysisData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.current}</TableCell>
              <TableCell>{item.threshold}</TableCell>
              <TableCell className="font-medium">{item.recommended}</TableCell>
              <TableCell>{item.lastSales} unités</TableCell>
              <TableCell>
                {item.trend === 'up' ? (
                  <ArrowUpIcon className="text-green-500 h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="text-red-500 h-4 w-4" />
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'outline' : 'secondary'}
                >
                  {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </Badge>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {getStatusBadge(item.status)}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{item.notes}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  );
};
