
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisProductRow from './products-grid/AnalysisProductRow';
import SimulationSummary from './pricing/SimulationSummary';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProductPrices } from '@/hooks/useProductPrices';
import { usePricingCalculation } from './pricing/usePricingCalculation';

const BudgetSimulation: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('tab1');
  const { products, isLoading: isProductsLoading } = useProducts('analysis');
  const { analysisItems, isLoading: isAnalysisLoading } = useAnalysisItems();
  const { productPrices, isLoading: isPricesLoading } = useProductPrices();
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    getUnitPriceForSKU
  } = usePricingCalculation(productPrices);

  const isLoading = isProductsLoading || isAnalysisLoading || isPricesLoading;

  const getCategoryProducts = (category: string) => {
    return products.filter(product => {
      const skuCategory = product.SKU ? product.SKU.split('-')[0] : '';
      return skuCategory.toLowerCase() === category.toLowerCase();
    });
  };

  const hasCategoryProducts = (category: string) => {
    return getCategoryProducts(category).length > 0;
  };

  // Handle row click for product details
  const handleRowClick = (item: any) => {
    console.log('Product row clicked:', item);
    // This would typically open a details drawer or modal
  };

  // Toggle note expansion
  const toggleNoteExpansion = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setExpandedNoteId(prev => prev === productId ? null : productId);
  };

  // Refetch analysis data
  const refetchAnalysis = () => {
    console.log('Refetching analysis data');
    // This would typically call the refetch functions from the hooks
  };

  // Categories to display
  const categories = ["BNT", "CLO", "BLC", "BAN", "PNF", "CAR", "AAA"];

  return (
    <Card className="border border-[#272727] bg-[#131313]">
      <CardHeader className="px-4 py-3 border-b border-[#272727]">
        <CardTitle className="text-sm font-medium">Simulateur de Budget</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="w-full px-2 border-b border-[#272727] bg-[#131313]">
            <TabsTrigger
              value="tab1"
              className={`text-xs py-2 px-4 ${selectedTab === 'tab1' ? 'border-b-2 border-primary' : ''}`}
            >
              Par Catégorie
            </TabsTrigger>
            <TabsTrigger
              value="tab2"
              className={`text-xs py-2 px-4 ${selectedTab === 'tab2' ? 'border-b-2 border-primary' : ''}`}
            >
              Par Produit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tab1" className="p-4">
            {categories.map((category) => (
              hasCategoryProducts(category) && (
                <div key={category} className="mb-4">
                  <h3 className="text-md font-medium mb-2">{category}</h3>
                  <div className="space-y-2">
                    {getCategoryProducts(category).map((product) => (
                      <AnalysisProductRow
                        key={product.id}
                        item={{
                          id: analysisItems.find(item => item.product_id === product.id)?.id || '',
                          product_id: product.id,
                          sku_code: product.SKU,
                          sku_label: product.product_name,
                          stock: product.current_stock,
                          threshold: product.threshold,
                          note: product.note,
                          quantity_selected: analysisItems.find(item => item.product_id === product.id)?.quantity_selected || null,
                          created_at: product.created_at,
                          updated_at: product.updated_at,
                          status: product.status || '',
                          last_order_info: analysisItems.find(item => item.product_id === product.id)?.last_order_info || null,
                          lab_status_text: analysisItems.find(item => item.product_id === product.id)?.lab_status_text || null,
                          last_order_date: analysisItems.find(item => item.product_id === product.id)?.last_order_date || null,
                          weeks_delivery: analysisItems.find(item => item.product_id === product.id)?.weeks_delivery || null,
                          priority_badge: product.priority_badge
                        }}
                        handleRowClick={handleRowClick}
                        toggleNoteExpansion={toggleNoteExpansion}
                        refetchAnalysis={refetchAnalysis}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
          </TabsContent>

          <TabsContent value="tab2" className="p-4">
            <div className="space-y-2">
              {products.map((product) => (
                <AnalysisProductRow
                  key={product.id}
                  item={{
                    id: analysisItems.find(item => item.product_id === product.id)?.id || '',
                    product_id: product.id,
                    sku_code: product.SKU,
                    sku_label: product.product_name,
                    stock: product.current_stock,
                    threshold: product.threshold,
                    note: product.note,
                    quantity_selected: analysisItems.find(item => item.product_id === product.id)?.quantity_selected || null,
                    created_at: product.created_at,
                    updated_at: product.updated_at,
                    status: product.status || '',
                    last_order_info: analysisItems.find(item => item.product_id === product.id)?.last_order_info || null,
                    lab_status_text: analysisItems.find(item => item.product_id === product.id)?.lab_status_text || null,
                    last_order_date: analysisItems.find(item => item.product_id === product.id)?.last_order_date || null,
                    weeks_delivery: analysisItems.find(item => item.product_id === product.id)?.weeks_delivery || null,
                    priority_badge: product.priority_badge
                  }}
                  handleRowClick={handleRowClick}
                  toggleNoteExpansion={toggleNoteExpansion}
                  refetchAnalysis={refetchAnalysis}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="p-4">
          <SimulationSummary 
            analysisItems={analysisItems}
            products={products}
            simulationTotal={simulationTotal}
            selectedSKUs={selectedSKUs}
            quantities={quantities}
            calculatedPrices={calculatedPrices}
            productPrices={productPrices}
            getUnitPriceForSKU={getUnitPriceForSKU}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSimulation;
