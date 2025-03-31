
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { useSKUSelection } from './hooks/useSKUSelection';
import { usePriceCalculation } from './hooks/usePriceCalculation';
import { useQuantityManagement } from './hooks/useQuantityManagement';
import { getUnitPriceForSKU } from './hooks/utils/priceUtils';

export function usePricingCalculation(productPrices: ProductPrice[]) {
  const { toast } = useToast();
  
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

  // Get the price for a SKU based on its quantity
  const getUnitPriceForSKUWrapper = (sku: string, quantity: number): number => {
    return getUnitPriceForSKU(productPrices, sku, quantity);
  };

  // Handle quantity change for a selected SKU with price calculation
  const handleQuantityChangeWithPrice = (productId: string, sku: string, quantityValue: string) => {
    // Update the quantity
    handleQuantityChange(productId, sku, quantityValue);
    
    // Calculate the price for this quantity
    const parsedQuantity = parseInt(quantityValue, 10) || 0;
    const unitPrice = getUnitPriceForSKUWrapper(sku, parsedQuantity);
    const totalPrice = parsedQuantity * unitPrice;
    
    // Update the calculated price for this SKU
    setCalculatedPrice(productId, sku, totalPrice);
    
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

  // Reset the entire simulation
  const resetSimulation = () => {
    resetSKUSelection();
    resetQuantities();
    resetPriceCalculations();
    
    toast({
      title: "Simulation réinitialisée",
      description: "Toutes les sélections ont été effacées."
    });
  };

  return {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    handleSKUSelect,
    handleSKURemove: handleSKURemoveWithCleanup,
    handleQuantityChange: handleQuantityChangeWithPrice,
    getTotalForProduct,
    getUnitPriceForSKU: getUnitPriceForSKUWrapper,
    resetSimulation,
  };
}
