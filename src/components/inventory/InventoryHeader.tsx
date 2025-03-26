
import React from 'react';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InventoryHeader: React.FC = () => {
  return (
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
  );
};
