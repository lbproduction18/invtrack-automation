
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, MapPinIcon, TruckIcon } from 'lucide-react';

export const DeliveryContent: React.FC = () => {
  return (
    <CardContent className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1A1A1A] p-3 rounded-lg border border-[#272727]">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-4 w-4 text-[#3ECF8E]" />
            <span className="text-sm font-medium">Date de livraison</span>
          </div>
          <p className="text-lg font-bold">28 Mars 2025</p>
        </div>
        
        <div className="bg-[#1A1A1A] p-3 rounded-lg border border-[#272727]">
          <div className="flex items-center gap-2 mb-2">
            <TruckIcon className="h-4 w-4 text-[#3ECF8E]" />
            <span className="text-sm font-medium">Transporteur</span>
          </div>
          <p className="text-lg font-bold">Transport Express</p>
        </div>
        
        <div className="bg-[#1A1A1A] p-3 rounded-lg border border-[#272727]">
          <div className="flex items-center gap-2 mb-2">
            <MapPinIcon className="h-4 w-4 text-[#3ECF8E]" />
            <span className="text-sm font-medium">Numéro de suivi</span>
          </div>
          <p className="text-lg font-bold">TE23456789</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Statut de livraison</span>
          <Badge variant="outline" className="bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/20">
            En transit
          </Badge>
        </div>
        <Progress value={65} className="h-2 bg-[#272727]" />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Commande</span>
          <span>Préparation</span>
          <span>Expédition</span>
          <span>Livraison</span>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Étape</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Commande validée</TableCell>
            <TableCell>25/03/2025</TableCell>
            <TableCell>-</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Complété
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Préparation</TableCell>
            <TableCell>26/03/2025</TableCell>
            <TableCell>Entrepôt central</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Complété
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Expédition</TableCell>
            <TableCell>27/03/2025</TableCell>
            <TableCell>Centre logistique</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/20">
                En cours
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Livraison</TableCell>
            <TableCell>28/03/2025</TableCell>
            <TableCell>Votre entrepôt</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">
                À venir
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  );
};
