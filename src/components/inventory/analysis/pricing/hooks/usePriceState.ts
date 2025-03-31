
// Import necessary types and hooks
import { useState, useCallback } from 'react';
import { type ProductPrice } from '@/hooks/useProductPrices';

export const usePriceState = (productPrices: ProductPrice[]) => {
  // Initialize state for calculated prices
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number>>({});
  // Add state for the simulation total
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  
  // Function to calculate and update the price for a specific SKU and quantity
  const calculatePrice = useCallback((SKU: string, quantity: number) => {
    // Find the product price data for the given SKU
    const productPrice = productPrices.find(price => price.product_name === SKU);
    
    if (!productPrice) {
      console.warn(`No price data found for SKU: ${SKU}`);
      setCalculatedPrices(prev => ({
        ...prev,
        [SKU]: 0
      }));
      return;
    }
    
    // Determine which price to use based on quantity
    let unitPrice = 0;
    
    if (quantity <= 1000 && productPrice.price_1000) {
      unitPrice = productPrice.price_1000;
    } else if (quantity <= 2000 && productPrice.price_2000) {
      unitPrice = productPrice.price_2000;
    } else if (quantity <= 3000 && productPrice.price_3000) {
      unitPrice = productPrice.price_3000;
    } else if (quantity <= 4000 && productPrice.price_4000) {
      unitPrice = productPrice.price_4000;
    } else if (quantity <= 5000 && productPrice.price_5000) {
      unitPrice = productPrice.price_5000;
    } else if (quantity <= 8000 && productPrice.price_8000) {
      unitPrice = productPrice.price_8000;
    } else if (productPrice.price_8000) {
      // If quantity is above all brackets, use the highest bracket
      unitPrice = productPrice.price_8000;
    }
    
    // Calculate the total price
    const totalPrice = unitPrice * quantity;
    
    // Update the calculated prices state
    setCalculatedPrices(prev => ({
      ...prev,
      [SKU]: totalPrice
    }));
  }, [productPrices]);
  
  // Function to get the total price for all products
  const getTotalPrice = useCallback(() => {
    return Object.values(calculatedPrices).reduce((total, price) => {
      // Ensure we're dealing with numeric values
      const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
      return total + (isNaN(numericPrice) ? 0 : numericPrice);
    }, 0);
  }, [calculatedPrices]);
  
  // Function to reset all calculated prices
  const resetPrices = useCallback(() => {
    setCalculatedPrices({});
    setSimulationTotal(0);
  }, []);
  
  // Return the state and functions
  return {
    calculatedPrices,
    calculatePrice,
    getTotalPrice,
    resetPrices,
    simulationTotal,
    setSimulationTotal
  };
};
