
import { useState, useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { QuantityOption } from '@/components/inventory/AnalysisContent';

export function usePriceState(productPrices: ProductPrice[]) {
  // State for selected SKUs, quantities, and calculated prices
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string[]>>({});
  const [quantities, setQuantities] = useState<Record<string, Record<string, string>>>({});
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, Record<string, number | string>>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  // Get unit price for a specific SKU and quantity
  const getUnitPriceForSKU = (sku: string, quantity: number): number => {
    // Find the product price entry that matches this SKU
    const productPrice = productPrices.find(price => {
      // Extract the category from the SKU (e.g., "BNT" from "BNT-LOTUS")
      const skuCategory = sku.split('-')[0];
      // Check if the product name contains this category
      return price.product_name.toLowerCase().includes(skuCategory.toLowerCase());
    });

    if (!productPrice) return 0;

    // Determine which price field to use based on quantity
    let priceField: keyof ProductPrice;
    
    if (quantity <= 1000) {
      priceField = 'price_1000';
    } else if (quantity <= 2000) {
      priceField = 'price_2000';
    } else if (quantity <= 3000) {
      priceField = 'price_3000';
    } else if (quantity <= 4000) {
      priceField = 'price_4000';
    } else if (quantity <= 5000) {
      priceField = 'price_5000';
    } else {
      priceField = 'price_8000';
    }

    // Return the price or 0 if not available
    return productPrice[priceField] as number || 0;
  };

  // Handle adding a SKU to the selection
  const handleSKUSelect = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = { ...prev };
      if (!updatedSKUs[productId]) {
        updatedSKUs[productId] = [];
      }
      if (!updatedSKUs[productId].includes(sku)) {
        updatedSKUs[productId] = [...updatedSKUs[productId], sku];
      }
      return updatedSKUs;
    });
  };

  // Handle removing a SKU from the selection
  const handleSKURemove = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      const updatedSKUs = { ...prev };
      if (updatedSKUs[productId]) {
        updatedSKUs[productId] = updatedSKUs[productId].filter(s => s !== sku);
        if (updatedSKUs[productId].length === 0) {
          delete updatedSKUs[productId];
        }
      }
      return updatedSKUs;
    });

    // Also clean up quantities and calculated prices
    setQuantities(prev => {
      const updatedQuantities = { ...prev };
      if (updatedQuantities[productId]) {
        delete updatedQuantities[productId][sku];
        if (Object.keys(updatedQuantities[productId]).length === 0) {
          delete updatedQuantities[productId];
        }
      }
      return updatedQuantities;
    });

    setCalculatedPrices(prev => {
      const updatedPrices = { ...prev };
      if (updatedPrices[productId]) {
        delete updatedPrices[productId][sku];
        if (Object.keys(updatedPrices[productId]).length === 0) {
          delete updatedPrices[productId];
        }
      }
      return updatedPrices;
    });

    // Recalculate total
    setSimulationTotal(prev => {
      const prevTotal = prev || 0;
      const quantityValue = quantities[productId]?.[sku] || '0';
      const parsedQuantity = parseInt(quantityValue, 10) || 0;
      const unitPrice = getUnitPriceForSKU(sku, parsedQuantity);
      // Fix for the operator error - ensure we're working with numbers
      const skuTotal = parsedQuantity * unitPrice;
      return Math.max(0, prevTotal - skuTotal);
    });
  };

  // Handle quantity change for a selected SKU
  const handleQuantityChange = (productId: string, sku: string, quantityValue: string) => {
    // Update quantities state
    setQuantities(prev => {
      const updatedQuantities = { ...prev };
      if (!updatedQuantities[productId]) {
        updatedQuantities[productId] = {};
      }
      updatedQuantities[productId][sku] = quantityValue;
      return updatedQuantities;
    });

    // Calculate price based on quantity and update calculated prices
    const parsedQuantity = parseInt(quantityValue, 10) || 0;
    const unitPrice = getUnitPriceForSKU(sku, parsedQuantity);
    const totalPrice = parsedQuantity * unitPrice;

    setCalculatedPrices(prev => {
      const updatedPrices = { ...prev };
      if (!updatedPrices[productId]) {
        updatedPrices[productId] = {};
      }
      updatedPrices[productId][sku] = totalPrice;
      return updatedPrices;
    });

    // Recalculate total simulation price
    calculateSimulationTotal();
  };

  // Get price for a specific SKU
  const getPriceForSKU = (productId: string, sku: string): number | string => {
    return calculatedPrices[productId]?.[sku] || 0;
  };

  // Clear price for a specific SKU
  const clearPriceForSKU = (productId: string, sku: string) => {
    setCalculatedPrices(prev => {
      const updatedPrices = { ...prev };
      if (updatedPrices[productId]) {
        delete updatedPrices[productId][sku];
        if (Object.keys(updatedPrices[productId]).length === 0) {
          delete updatedPrices[productId];
        }
      }
      return updatedPrices;
    });
  };

  // Calculate total for a specific product
  const getTotalForProduct = (productId: string): number => {
    if (!calculatedPrices[productId]) return 0;
    
    return Object.values(calculatedPrices[productId]).reduce((sum, price) => {
      return sum + (typeof price === 'number' ? price : 0);
    }, 0);
  };

  // Calculate and set total price for a specific SKU
  const calculateTotalPrice = (productId: string, sku: string, quantityValue: string) => {
    const parsedQuantity = parseInt(quantityValue, 10) || 0;
    const unitPrice = getUnitPriceForSKU(sku, parsedQuantity);
    const totalPrice = parsedQuantity * unitPrice;

    setCalculatedPrices(prev => {
      const updatedPrices = { ...prev };
      if (!updatedPrices[productId]) {
        updatedPrices[productId] = {};
      }
      updatedPrices[productId][sku] = totalPrice;
      return updatedPrices;
    });
  };

  // Calculate total for the entire simulation
  const calculateSimulationTotal = () => {
    let total = 0;
    
    Object.keys(calculatedPrices).forEach(productId => {
      total += getTotalForProduct(productId);
    });
    
    setSimulationTotal(total);
  };

  // Reset the simulation
  const resetSimulation = () => {
    setSelectedSKUs({});
    setQuantities({});
    setCalculatedPrices({});
    setSimulationTotal(0);
  };

  // Reset price calculations specifically
  const resetPriceCalculations = () => {
    setCalculatedPrices({});
    setSimulationTotal(0);
  };

  // Recalculate total whenever calculated prices change
  useEffect(() => {
    calculateSimulationTotal();
  }, [calculatedPrices]);

  return {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    setSimulationTotal,
    handleSKUSelect,
    handleSKURemove,
    handleQuantityChange,
    getTotalForProduct,
    getUnitPriceForSKU,
    getPriceForSKU,
    calculateTotalPrice,
    clearPriceForSKU,
    resetPriceCalculations,
    resetSimulation,
  };
}
