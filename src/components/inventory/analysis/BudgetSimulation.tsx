
import React, { useState, useEffect } from 'react';
import { useProductPrices } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import BudgetSettingsPanel from './BudgetSettingsPanel';
import SimulationTable from './simulation/SimulationTable';

interface BudgetSimulationProps {
  onCreateOrder: () => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ onCreateOrder }) => {
  const { productPrices, isLoading, refetch } = useProductPrices();
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('analysis');
  const { toast } = useToast();
  
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, SelectedSKU[]>>({});
  
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];

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
  
  // Add a SKU to a product row
  const handleAddSKU = (productName: string, skuInfo: { id: string, SKU: string, productName: string | null }) => {
    setSelectedSKUs(prev => {
      const currentSKUs = prev[productName] || [];
      
      // Check if this SKU is already added
      const isAlreadyAdded = currentSKUs.some(sku => sku.SKU === skuInfo.SKU);
      if (isAlreadyAdded) {
        toast({
          title: "SKU déjà ajouté",
          description: `${skuInfo.SKU} est déjà dans la liste.`,
          variant: "destructive"
        });
        return prev;
      }
      
      // Find the matching product price for this product
      const productPrice = productPrices.find(p => p.product_name === productName);
      
      // Default to first quantity option with a price
      let defaultQuantity: QuantityOption = 1000;
      let defaultPrice = 0;
      
      if (productPrice) {
        // Try to find the first quantity that has a price
        for (const qty of quantityOptions) {
          const priceField = `price_${qty}` as keyof typeof productPrice;
          const price = productPrice[priceField] as number;
          if (price && price > 0) {
            defaultQuantity = qty;
            defaultPrice = price;
            break;
          }
        }
      }
      
      return {
        ...prev,
        [productName]: [
          ...currentSKUs,
          {
            productId: skuInfo.id,
            SKU: skuInfo.SKU,
            productName: skuInfo.productName,
            quantity: defaultQuantity,
            price: defaultPrice
          }
        ]
      };
    });
  };
  
  // Remove a SKU from a product row
  const handleRemoveSKU = (productName: string, skuIndex: number) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      updatedSKUs.splice(skuIndex, 1);
      
      const updatedSelection = {
        ...prev,
        [productName]: updatedSKUs
      };
      
      // If no SKUs left for this product, remove the key
      if (updatedSKUs.length === 0) {
        delete updatedSelection[productName];
      }
      
      return updatedSelection;
    });
  };
  
  // Handle quantity change for a SKU
  const handleQuantityChange = (productName: string, skuIndex: number, quantity: QuantityOption) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      if (updatedSKUs[skuIndex]) {
        // Find the price for this product and quantity
        const productPrice = productPrices.find(p => p.product_name === productName);
        const priceField = `price_${quantity}` as keyof typeof productPrice;
        const price = productPrice ? (productPrice[priceField] as number || 0) : 0;
        
        updatedSKUs[skuIndex] = {
          ...updatedSKUs[skuIndex],
          quantity,
          price
        };
      }
      
      return {
        ...prev,
        [productName]: updatedSKUs
      };
    });
  };
  
  // Calculate total price for a specific SKU
  const calculateSKUTotal = (sku: SelectedSKU): number => {
    return sku.quantity * sku.price;
  };
  
  // Refresh prices from Supabase
  const handleRefreshPrices = async () => {
    try {
      await refetch();
      toast({
        title: "Prix actualisés",
        description: "Les prix ont été rechargés depuis la base de données.",
      });
      calculateOrderTotal();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les prix. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate the total order amount
  const calculateOrderTotal = () => {
    let total = 0;
    
    Object.values(selectedSKUs).forEach(skuArray => {
      skuArray.forEach(sku => {
        total += calculateSKUTotal(sku);
      });
    });
    
    setSimulationTotal(total);
    return total;
  };
  
  // Update the total whenever selections change
  useEffect(() => {
    calculateOrderTotal();
  }, [selectedSKUs]);
  
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
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefreshPrices}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser les prix
        </Button>
      </div>
      
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
