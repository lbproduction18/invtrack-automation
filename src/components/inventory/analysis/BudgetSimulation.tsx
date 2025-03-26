
import React from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { useSimulationState } from '@/hooks/useSimulationState';
import { useSimulationSKUs } from '@/hooks/useSimulationSKUs';
import BudgetSettingsPanel from './BudgetSettingsPanel';
import SimulationTable from './simulation/SimulationTable';
import RefreshPricesButton from './simulation/RefreshPricesButton';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const { productPrices, isLoading, refetch } = useProductPrices();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('analysis');
  const { toast } = useToast();
  
  // Use our custom hooks for state management
  const { 
    simulationTotal, 
    selectedSKUs, 
    setSelectedSKUs,
    calculateSKUTotal
  } = useSimulationState();
  
  const {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange
  } = useSimulationSKUs(selectedSKUs, setSelectedSKUs, productPrices);

  // Group analysis products by parent product for the dropdown
  const groupedAnalysisProducts = React.useMemo(() => {
    const groupedProducts: Record<string, Array<{ id: string, SKU: string, productName: string | null }>> = {};
    
    products.forEach(product => {
      // Check if the product is in analysis
      if (analysisItems.some(item => item.product_id === product.id)) {
        const productName = product.product_name || '';
        // Extract the base product name (before any dash/hyphen)
        const baseProductName = productName.split('–')[0]?.trim() || productName;
        
        if (!groupedProducts[baseProductName]) {
          groupedProducts[baseProductName] = [];
        }
        
        groupedProducts[baseProductName].push({
          id: product.id,
          SKU: product.SKU,
          productName: product.product_name
        });
      }
    });
    
    return groupedProducts;
  }, [products, analysisItems]);
  
  // Refresh prices from Supabase
  const handleRefreshPrices = async () => {
    try {
      await refetch();
      toast({
        title: "Prix actualisés",
        description: "Les prix ont été rechargés depuis la base de données.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les prix. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Budget Settings Panel */}
      <div className="mb-6">
        <BudgetSettingsPanel
          totalOrderAmount={simulationTotal}
          onCreateOrder={onCreateOrder}
        />
      </div>
      
      {/* Refresh Prices Button */}
      <RefreshPricesButton onRefresh={handleRefreshPrices} />
      
      {/* Simulation Table */}
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
    </div>
  );
};

export default BudgetSimulation;
