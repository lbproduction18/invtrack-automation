
import React from 'react';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import OrderSimulationTable from '../OrderSimulationTable';
import PricingGrid from '../PricingGrid';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type ProductPrice } from '@/hooks/useProductPrices';

interface SimulationTabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isPricesLoading: boolean;
  productPrices: ProductPrice[];
  selectedQuantities: Record<string, QuantityOption>;
  onOrderQuantityChange: (productId: string, quantity: QuantityOption) => void;
  onSimulationTotalChange: (total: number) => void;
}

const SimulationTabsContainer: React.FC<SimulationTabsContainerProps> = ({
  activeTab,
  onTabChange,
  selectedQuantities,
  onOrderQuantityChange,
  onSimulationTotalChange
}) => {
  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <Tabs 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <div className="flex justify-between items-center px-4 pt-4">
          <TabsList className="bg-[#1A1A1A]">
            <TabsTrigger value="order">Commande</TabsTrigger>
            <TabsTrigger value="prices">Grille Tarifaire</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-4 pb-2">
          <TabsContent value="order" className="m-0">
            <OrderSimulationTable 
              selectedQuantities={selectedQuantities}
              onQuantityChange={onOrderQuantityChange}
              onSimulationTotalChange={onSimulationTotalChange}
            />
          </TabsContent>
          
          <TabsContent value="prices" className="m-0">
            <PricingGrid />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default SimulationTabsContainer;
