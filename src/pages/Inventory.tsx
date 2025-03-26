
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { LastUpdatedAlert } from '@/components/inventory/LastUpdatedAlert';
import { InventoryContent } from '@/components/inventory/InventoryContent';

const Inventory: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <InventoryHeader />
      <LastUpdatedAlert />
      
      <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="px-4 py-3 border-b border-[#272727]">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm font-medium text-white">Produits à Faible Stock</CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Surveillez et gérez les produits qui nécessitent un réapprovisionnement
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <InventoryContent />
      </Card>
    </div>
  );
};

export default Inventory;
