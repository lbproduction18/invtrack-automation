
import React from 'react';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import OrderSimulationTable from '../OrderSimulationTable';
import SimulationTable from './SimulationTable';
import PricingGrid from '../PricingGrid';
import RefreshPricesButton from './RefreshPricesButton';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';

interface SimulationTabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  isPricesLoading: boolean;
  onRefresh: () => void;
  productPrices: ProductPrice[];
  quantityOptions: QuantityOption[];
  selectedSKUs: Record<string, SelectedSKU[]>;
  groupedAnalysisProducts: Record<string, Array<{ id: string, SKU: string, productName: string | null }>>;
  simulationTotal: number;
  onAddSKU: (productName: string, skuInfo: { id: string, SKU: string, productName: string | null }) => void;
  onQuantityChange: (productName: string, skuIndex: number, quantity: QuantityOption) => void;
  onRemoveSKU: (productName: string, skuIndex: number) => void;
  calculateSKUTotal: (sku: SelectedSKU) => number;
  selectedQuantities: Record<string, QuantityOption>;
  onOrderQuantityChange: (productId: string, quantity: QuantityOption) => void;
  onSimulationTotalChange: (total: number) => void;
}

const SimulationTabsContainer: React.FC<SimulationTabsContainerProps> = ({
  activeTab,
  onTabChange,
  isPricesLoading,
  onRefresh,
  productPrices,
  quantityOptions,
  selectedSKUs,
  groupedAnalysisProducts,
  simulationTotal,
  onAddSKU,
  onQuantityChange,
  onRemoveSKU,
  calculateSKUTotal,
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
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="prices">Grille Tarifaire</TabsTrigger>
          </TabsList>
          
          <RefreshPricesButton 
            onRefresh={onRefresh} 
            isLoading={isPricesLoading}
          />
        </div>
        
        <CardContent className="pt-4 pb-2">
          <TabsContent value="order" className="m-0">
            <OrderSimulationTable 
              selectedQuantities={selectedQuantities}
              onQuantityChange={onOrderQuantityChange}
              onSimulationTotalChange={onSimulationTotalChange}
            />
          </TabsContent>
          
          <TabsContent value="simulation" className="m-0">
            <SimulationTable 
              productPrices={productPrices}
              isLoading={isPricesLoading}
              quantityOptions={quantityOptions}
              selectedSKUs={selectedSKUs}
              groupedAnalysisProducts={groupedAnalysisProducts}
              simulationTotal={simulationTotal}
              onAddSKU={onAddSKU}
              onQuantityChange={onQuantityChange}
              onRemoveSKU={onRemoveSKU}
              calculateSKUTotal={calculateSKUTotal}
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
