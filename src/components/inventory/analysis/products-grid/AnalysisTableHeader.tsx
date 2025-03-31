
import React from 'react';
import { TableHead, TableRow } from "@/components/ui/table";

const AnalysisTableHeader: React.FC = () => {
  return (
    <TableRow className="hover:bg-transparent border-b border-[#272727]">
      <TableHead className="text-xs font-medium text-gray-400 w-[18%] text-left pl-4">SKU / Produit</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center">Stock</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center">Seuil</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center">Note</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center">Qt dernière commande</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center">Date de dernière commande</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center">Étiquette labo</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center">Délai de livraison</TableHead>
      <TableHead className="text-xs font-medium text-gray-400 text-center w-[12%]">Actions</TableHead>
    </TableRow>
  );
};

export default AnalysisTableHeader;
