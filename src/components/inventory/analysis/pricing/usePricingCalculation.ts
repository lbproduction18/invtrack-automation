
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { useSKUSelection } from './hooks/useSKUSelection';
import { usePriceCalculation } from './hooks/usePriceCalculation';
import { useQuantityManagement } from './hooks/useQuantityManagement';
import { getUnitPriceForSKU } from './hooks/utils/priceUtils';
import { calculateTotalPrice } from '@/hooks/simulation/skuPriceHelpers';
import { useResetAnalysisItems } from '@/hooks/analysis/useResetAnalysisItems';

export function usePricingCalculation(productPrices: ProductPrice[]) {
  const { toast } = useToast();
  const { resetAnalysisItems } = useResetAnalysisItems();
  
  // Use our custom hooks for SKU selection, price calculation, and quantity management
  const { 
    selectedSKUs, 
    handleSKUSelect, 
    handleSKURemove,
    resetSKUSelection
  } = useSKUSelection();
  
  const {
    quantities,
    handleQuantityChange,
    clearQuantityForSKU,
    resetQuantities
  } = useQuantityManagement();
  
  const {
    calculatedPrices,
    simulationTotal,
    getPriceForSKU,
    setCalculatedPrice,
    clearPriceForSKU,
    resetPriceCalculations,
    getTotalForProduct
  } = usePriceCalculation();

  // State to track if all products have at least one price defined
  const [allProductsHavePrices, setAllProductsHavePrices] = useState(false);

  // Handle quantity change for a selected SKU with price calculation
  const handleQuantityChangeWithPrice = (productId: string, sku: string, quantityValue: string) => {
    // Validate the quantity value
    const parsedQuantity = parseInt(quantityValue, 10) || 0;
    if (parsedQuantity <= 0) {
      toast({
        title: "Quantité invalide",
        description: "La quantité doit être supérieure à zéro.",
        variant: "destructive"
      });
      return quantityValue;
    }
    
    // Update the quantity
    handleQuantityChange(productId, sku, quantityValue);
    
    // Get the unit price for this SKU and quantity using the tiered pricing logic
    const unitPrice = getUnitPriceForSKU(productPrices, sku, parsedQuantity);
    
    // Calculate the total price for this SKU
    const totalPrice = calculateTotalPrice(unitPrice, parsedQuantity);
    
    // Update the calculated price for this SKU
    setCalculatedPrice(productId, sku, totalPrice);
    
    console.log(`Updated price for ${sku}: ${unitPrice} x ${parsedQuantity} = ${totalPrice}`);
    
    return quantityValue;
  };

  // Remove a SKU and clean up related data
  const handleSKURemoveWithCleanup = (productId: string, sku: string) => {
    // Remove the SKU from selections
    handleSKURemove(productId, sku);
    
    // Clean up price and quantity data
    clearPriceForSKU(productId, sku);
    clearQuantityForSKU(productId, sku);
  };

  // Handle SKU selection with initial price calculation
  const handleSKUSelectWithPrice = (productId: string, sku: string) => {
    // Add the SKU to selections
    handleSKUSelect(productId, sku);
    
    // Set initial quantity to 1000
    const initialQuantity = "1000";
    handleQuantityChange(productId, sku, initialQuantity);
    
    // Calculate the initial price
    const parsedQuantity = parseInt(initialQuantity, 10);
    const unitPrice = getUnitPriceForSKU(productPrices, sku, parsedQuantity);
    const totalPrice = calculateTotalPrice(unitPrice, parsedQuantity);
    
    // Set the calculated price
    setCalculatedPrice(productId, sku, totalPrice);
    
    console.log(`Initial price for ${sku}: ${unitPrice} x ${parsedQuantity} = ${totalPrice}`);
  };

  // Reset the entire simulation
  const resetSimulation = async () => {
    // Reset frontend state first
    resetSKUSelection();
    resetQuantities();
    resetPriceCalculations();
    
    // Now reset database values
    try {
      await resetAnalysisItems.mutateAsync();
      console.log("Database reset completed successfully");
    } catch (error) {
      console.error("Error during database reset:", error);
      // UI notification already handled by the mutation hook
    }
  };

  // Check if all products have at least one price defined
  const checkAllProductsHavePrices = () => {
    // If there are no product prices, return false
    if (productPrices.length === 0) {
      return false;
    }

    // Check each product to see if it has at least one price defined
    const allHavePrices = productPrices.every(product => {
      return (
        (product.price_1000 !== null && product.price_1000 !== undefined && product.price_1000 > 0) ||
        (product.price_2000 !== null && product.price_2000 !== undefined && product.price_2000 > 0) ||
        (product.price_3000 !== null && product.price_3000 !== undefined && product.price_3000 > 0) ||
        (product.price_4000 !== null && product.price_4000 !== undefined && product.price_4000 > 0) ||
        (product.price_5000 !== null && product.price_5000 !== undefined && product.price_5000 > 0) ||
        (product.price_8000 !== null && product.price_8000 !== undefined && product.price_8000 > 0)
      );
    });

    return allHavePrices;
  };

  // Update the allProductsHavePrices state whenever productPrices changes
  useEffect(() => {
    const result = checkAllProductsHavePrices();
    setAllProductsHavePrices(result);
  }, [productPrices]);

  return {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    handleSKUSelect: handleSKUSelectWithPrice,
    handleSKURemove: handleSKURemoveWithCleanup,
    handleQuantityChange: handleQuantityChangeWithPrice,
    getTotalForProduct,
    getUnitPriceForSKU: (sku: string, quantity: number) => getUnitPriceForSKU(productPrices, sku, quantity),
    resetSimulation,
    allProductsHavePrices,
  };
}
