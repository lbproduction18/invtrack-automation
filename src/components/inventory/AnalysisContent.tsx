
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnalysisItemDialog } from './analysis/AnalysisItemDialog';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AnalysisContent: React.FC = () => {
  // État pour suivre les éléments et l'élément sélectionné pour le popup
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [analysisMockData, setAnalysisMockData] = useState([
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
      notes: 'Produit à forte demande saisonnière',
      addedDate: '2023-11-15',
      age: 120,
      // Nouvelles propriétés pour l'analyse
      quantityToOrder: 15,
      lastOrderQuantity: null,
      lastOrderDate: null,
      labStatus: null,
      estimatedDeliveryDate: null,
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
      notes: 'Commande récente en attente de livraison',
      addedDate: '2023-12-22',
      age: 90,
      quantityToOrder: 25,
      lastOrderQuantity: 20,
      lastOrderDate: '2024-01-15',
      labStatus: 'ok',
      estimatedDeliveryDate: '2024-06-15',
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
      notes: 'Fournisseur principal en rupture, contacter alternative',
      addedDate: '2024-01-10',
      age: 75,
      quantityToOrder: 10,
      lastOrderQuantity: null,
      lastOrderDate: null,
      labStatus: null,
      estimatedDeliveryDate: null,
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
      notes: 'Stock suffisant pour le moment',
      addedDate: '2024-02-01',
      age: 60,
      quantityToOrder: 0,
      lastOrderQuantity: 15,
      lastOrderDate: '2024-02-10',
      labStatus: 'ok',
      estimatedDeliveryDate: null,
    },
  ]);

  // Fonction pour ouvrir le popup
  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  // Fonction pour fermer le popup
  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  // Fonction pour mettre à jour les données d'un item
  const handleUpdateItem = (updatedItem) => {
    setAnalysisMockData(prevData => 
      prevData.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      )
    );
    setSelectedItem(null);
  };

  // Vérifier si un item a des informations manquantes importantes
  const hasMissingInfo = (item) => {
    return !item.lastOrderQuantity || !item.lastOrderDate || !item.labStatus;
  };

  return (
    <CardContent className="p-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Quantité à commander</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analysisMockData.map((item) => (
              <TableRow 
                key={item.id} 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleRowClick(item)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {item.sku}
                    {hasMissingInfo(item) && (
                      <AlertCircle 
                        className="h-4 w-4 text-yellow-500" 
                        title="Informations manquantes"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className={cn(
                  "text-right font-medium", 
                  item.quantityToOrder > 0 ? "text-[#3ECF8E]" : ""
                )}>
                  {item.quantityToOrder}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <AnalysisItemDialog 
          item={selectedItem} 
          onClose={handleCloseDialog}
          onUpdate={handleUpdateItem}
        />
      )}
    </CardContent>
  );
};
