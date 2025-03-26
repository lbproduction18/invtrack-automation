
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Printer, Send } from 'lucide-react';

export const OrderContent: React.FC = () => {
  const orderData = [
    { id: 1, sku: 'SKU-001', name: 'Produit A', quantity: 15, price: 25.99, total: 389.85 },
    { id: 2, sku: 'SKU-002', name: 'Produit B', quantity: 25, price: 15.50, total: 387.50 },
    { id: 3, sku: 'SKU-003', name: 'Produit C', quantity: 10, price: 35.75, total: 357.50 },
  ];

  const totalAmount = orderData.reduce((sum, item) => sum + item.total, 0);

  return (
    <CardContent className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium">Fournisseur: Supplier XYZ</h3>
          <p className="text-xs text-gray-400">Bon de commande #BC-2025-03</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Validé
        </Badge>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Qté</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price.toFixed(2)} €</TableCell>
              <TableCell className="text-right">{item.total.toFixed(2)} €</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
            <TableCell className="text-right font-bold">{totalAmount.toFixed(2)} €</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Printer className="h-4 w-4" />
          Imprimer
        </Button>
        <Button variant="default" size="sm" className="flex items-center gap-1">
          <Send className="h-4 w-4" />
          Envoyer
        </Button>
      </div>
    </CardContent>
  );
};
