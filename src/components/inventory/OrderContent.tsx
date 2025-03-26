
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Printer, Send, Edit2, Save, Calendar, User, Building, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const OrderContent: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  
  const orderData = [
    { id: 1, sku: 'SKU-001', name: 'Produit A', quantity: 15, price: 25.99, total: 389.85 },
    { id: 2, sku: 'SKU-002', name: 'Produit B', quantity: 25, price: 15.50, total: 387.50 },
    { id: 3, sku: 'SKU-003', name: 'Produit C', quantity: 10, price: 35.75, total: 357.50 },
  ];

  const totalAmount = orderData.reduce((sum, item) => sum + item.total, 0);

  return (
    <CardContent className="p-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="text-sm font-medium">Fournisseur: Supplier XYZ</h3>
            <p className="text-xs text-gray-400">Bon de commande #BC-2025-03</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Validé
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div className="space-y-2 border border-[#272727] rounded-md p-3">
            <h4 className="text-xs font-medium flex items-center gap-2"><Building className="h-3 w-3" /> Informations Fournisseur</h4>
            <div className="space-y-1">
              {editMode ? (
                <>
                  <Select defaultValue="supplier1">
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Sélectionner un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier1">Supplier XYZ</SelectItem>
                      <SelectItem value="supplier2">Acme Corp</SelectItem>
                      <SelectItem value="supplier3">Global Distribution</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="h-8 text-xs" placeholder="Contact" defaultValue="John Doe" />
                  <Input className="h-8 text-xs" placeholder="Email" defaultValue="contact@supplier.com" />
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">Supplier XYZ</p>
                  <p className="text-xs text-muted-foreground">Contact: John Doe</p>
                  <p className="text-xs text-muted-foreground">Email: contact@supplier.com</p>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2 border border-[#272727] rounded-md p-3">
            <h4 className="text-xs font-medium flex items-center gap-2"><Calendar className="h-3 w-3" /> Détails de la commande</h4>
            <div className="space-y-1">
              {editMode ? (
                <>
                  <Input className="h-8 text-xs" type="date" defaultValue="2025-03-15" />
                  <Select defaultValue="standard">
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Type de livraison" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="express">Express (24h)</SelectItem>
                      <SelectItem value="standard">Standard (3-5j)</SelectItem>
                      <SelectItem value="economic">Économique (7-10j)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="bank">
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Méthode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Virement bancaire</SelectItem>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                      <SelectItem value="check">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">Date: 15/03/2025</p>
                  <p className="text-xs text-muted-foreground">Livraison: Standard (3-5j)</p>
                  <p className="text-xs text-muted-foreground">Paiement: Virement bancaire</p>
                </>
              )}
            </div>
          </div>
        </div>
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
              <TableCell>
                {editMode ? (
                  <Input 
                    type="number" 
                    className="h-7 w-16" 
                    defaultValue={item.quantity} 
                  />
                ) : (
                  item.quantity
                )}
              </TableCell>
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
        {editMode ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setEditMode(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setEditMode(false)}
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setEditMode(true)}
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button variant="default" size="sm" className="flex items-center gap-1">
              <Send className="h-4 w-4" />
              Envoyer
            </Button>
          </>
        )}
      </div>
    </CardContent>
  );
};
