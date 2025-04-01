
import { useState, useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { QuantityOption } from '@/components/inventory/AnalysisContent';
import { useSkuManagement } from './useSkuManagement';
import { usePriceCalculation } from './usePriceCalculation';
import { useQuantityManagement } from './useQuantityManagement';
import { getUnitPriceForSKU, calculateSKUTotalPrice } from './utils/priceUtils';

export function usePriceState(productPrices: ProductPrice[]) {
  // Use our smaller, focused hooks
  const { 
    selectedSKUs, 
    handleSKUSelect, 
    handleSKURemove, 
    resetSKUSelection 
  } = useSkuManagement();
  
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
    calculateSimulationTotal, 
    resetPriceCalculations,
    getTotalForProduct 
  } = usePriceCalculation();

  // Helper to get unit price (wraps the util function)
  const getUnitPriceForSKUWrapper = (sku: string, quantity: number): number => {
    return getUnitPriceForSKU(productPrices, sku, quantity);
  };

  // Handle quantity change for a selected SKU
  const handleQuantityChangeWithPriceCalc = (productId: string, sku: string, quantityValue: string) => {
    // Update quantities state
    handleQuantityChange(productId, sku, quantityValue);

    // Calculate price based on quantity and update calculated prices
    const parsedQuantity = parseInt(quantityValue, 10) || 0;
    const totalPrice = calculateSKUTotalPrice(
      sku, 
      parsedQuantity, 
      productPrices
    );

    // Update the calculated price
    setCalculatedPrice(productId, sku, totalPrice);
  };

  // Handle removing a SKU with cleanup
  const handleSKURemoveWithCleanup = (productId: string, sku: string) => {
    // Clean up associated data
    clearQuantityForSKU(productId, sku);
    clearPriceForSKU(productId, sku);
    
    // Now remove the SKU
    handleSKURemove(productId, sku);
  };

  // Calculate total price for a SKU
  const calculateTotalPrice = (productId: string, sku: string, quantityValue: string) => {
    const parsedQuantity = parseInt(quantityValue, 10) || 0;
    const totalPrice = calculateSKUTotalPrice(
      sku, 
      parsedQuantity, 
      productPrices
    );

    setCalculatedPrice(productId, sku, totalPrice);
  };

  // Reset the entire simulation
  const resetSimulation = () => {
    resetSKUSelection();
    resetQuantities();
    resetPriceCalculations();
  };

  return {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    handleSKUSelect,
    handleSKURemove: handleSKURemoveWithCleanup,
    handleQuantityChange: handleQuantityChangeWithPriceCalc,
    getTotalForProduct,
    getUnitPriceForSKU: getUnitPriceForSKUWrapper,
    getPriceForSKU,
    calculateTotalPrice,
    clearPriceForSKU,
    resetPriceCalculations,
    resetSimulation,
  };
}
