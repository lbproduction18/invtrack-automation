
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisProductRow from './products-grid/AnalysisProductRow';
import SimulationSummary from './pricing/SimulationSummary';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProductPrices } from '@/hooks/useProductPrices';
import { usePricingCalculation } from './pricing/usePricingCalculation';
import { AnalysisProduct } from '@/components/inventory/AnalysisContent';

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

  // Create a mapping between product IDs and AnalysisItems
  const analysisItemsMap = analysisItems.reduce((acc, item) => {
    if (item.product_id) {
      acc[item.product_id] = item;
    }
    return acc;
  }, {} as Record<string, typeof analysisItems[0]>);

  // Helper function to create a properly typed AnalysisProduct object
  const createAnalysisProduct = (product: typeof products[0], analysisItem: typeof analysisItems[0] | undefined): AnalysisProduct => {
    return {
      id: analysisItem?.id || '',
      product_id: product.id,
      sku_code: analysisItem?.sku_code || product.SKU,
      sku_label: analysisItem?.sku_label || product.product_name || '',
      stock: analysisItem?.stock || product.current_stock,
      threshold: analysisItem?.threshold || product.threshold,
      note: analysisItem?.note || product.note || null,
      quantity_selected: analysisItem?.quantity_selected || null,
      created_at: analysisItem?.created_at || product.created_at,
      updated_at: analysisItem?.updated_at || product.updated_at,
      status: analysisItem?.status || product.status || '',
      last_order_info: analysisItem?.last_order_info || null,
      lab_status_text: analysisItem?.lab_status_text || null,
      last_order_date: analysisItem?.last_order_date || null,
      weeks_delivery: analysisItem?.weeks_delivery || null,
      priority_badge: analysisItem?.priority_badge || product.priority_badge,
      price_1000: analysisItem?.price_1000 || product.price_1000 || null,
      price_2000: analysisItem?.price_2000 || product.price_2000 || null,
      price_3000: analysisItem?.price_3000 || product.price_3000 || null,
      price_4000: analysisItem?.price_4000 || product.price_4000 || null,
      price_5000: analysisItem?.price_5000 || product.price_5000 || null,
      price_8000: analysisItem?.price_8000 || null,
      productDetails: {
        id: product.id,
        SKU: product.SKU,
        product_name: product.product_name,
        current_stock: product.current_stock,
        threshold: product.threshold,
        lab_status: product.lab_status,
        estimated_delivery_date: product.estimated_delivery_date,
        last_order_date: product.last_order_date,
        last_order_quantity: product.last_order_quantity,
        note: product.note,
        priority_badge: product.priority_badge,
        created_at: product.created_at
      }
    };
  };

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
                    {getCategoryProducts(category).map((product) => {
                      const analysisItem = analysisItemsMap[product.id];
                      const analysisProduct = createAnalysisProduct(product, analysisItem);
                      
                      return (
                        <AnalysisProductRow
                          key={product.id}
                          item={analysisProduct}
                          handleRowClick={handleRowClick}
                          toggleNoteExpansion={toggleNoteExpansion}
                          refetchAnalysis={refetchAnalysis}
                        />
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </TabsContent>

          <TabsContent value="tab2" className="p-4">
            <div className="space-y-2">
              {products.map((product) => {
                const analysisItem = analysisItemsMap[product.id];
                const analysisProduct = createAnalysisProduct(product, analysisItem);
                
                return (
                  <AnalysisProductRow
                    key={product.id}
                    item={analysisProduct}
                    handleRowClick={handleRowClick}
                    toggleNoteExpansion={toggleNoteExpansion}
                    refetchAnalysis={refetchAnalysis}
                  />
                );
              })}
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
