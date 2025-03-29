
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody 
} from "@/components/ui/table";
import { useProductPrices } from '@/hooks/useProductPrices';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SimulationTable from './simulation/SimulationTable';
import { useSimulationState } from '@/hooks/useSimulationState';
import { useSimulationSKUs } from '@/hooks/useSimulationSKUs';
import TotalSummary from './simulation/TotalSummary';
import { type QuantityOption } from '../AnalysisContent';

const PricingGrid: React.FC = () => {
  const { productPrices, isLoading } = useProductPrices();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('all');
  
  // Group analysis products by product name
  const [groupedAnalysisProducts, setGroupedAnalysisProducts] = useState<Record<string, Array<{ id: string, SKU: string, productName: string | null }>>>({});
  
  // Use the simulation state and SKU management hooks
  const {
    simulationTotal,
    selectedSKUs,
    setSelectedSKUs,
    calculateSKUTotal,
    calculateOrderTotal
  } = useSimulationState();
  
  const {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange
  } = useSimulationSKUs(
    selectedSKUs,
    setSelectedSKUs,
    productPrices
  );

  // Prepare product data on component mount
  useEffect(() => {
    // Get all products in analysis
    const analysisProductIds = analysisItems.map(item => item.product_id);
    
    // Get the corresponding product details
    const analysisProducts = products.filter(product => analysisProductIds.includes(product.id));
    
    console.log('Analysis products:', analysisProducts);
    
    // Group products by category (extract from SKU)
    const grouped: Record<string, Array<{ id: string, SKU: string, productName: string | null }>> = {};
    
    analysisProducts.forEach(product => {
      // Extract product category from SKU
      const skuParts = product.SKU.split('-');
      const productCategory = skuParts[0];
      
      if (!grouped[productCategory]) {
        grouped[productCategory] = [];
      }
      
      grouped[productCategory].push({
        id: product.id,
        SKU: product.SKU,
        productName: product.product_name
      });
    });
    
    console.log('Grouped analysis products:', grouped);
    setGroupedAnalysisProducts(grouped);
  }, [analysisItems, products]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des prix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <ScrollArea className="h-[600px]">
          <SimulationTable
            productPrices={productPrices}
            isLoading={isLoading}
            quantityOptions={quantityOptions}
            selectedSKUs={selectedSKUs}
            groupedAnalysisProducts={groupedAnalysisProducts}
            simulationTotal={simulationTotal}
            onAddSKU={handleAddSKU}
            onQuantityChange={handleQuantityChange}
            onRemoveSKU={handleRemoveSKU}
            calculateSKUTotal={calculateSKUTotal}
          />
        </ScrollArea>
      </div>
      
      {/* Total Summary Section */}
      <TotalSummary simulationTotal={simulationTotal} />
    </div>
  );
};

export default PricingGrid;
