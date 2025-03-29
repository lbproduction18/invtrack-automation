
import { useState, useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';

/**
 * Hook to handle pricing calculations for the pricing grid
 */
export function usePricingCalculation(productPrices: ProductPrice[]) {
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number | string>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  // Standard quantities that match price columns
  const standardQuantities = [1000, 2000, 3000, 4000, 5000, 8000];

  // Calculate the total simulation amount whenever calculatedPrices change
  useEffect(() => {
    let total = 0;
    
    // Sum up all the numeric values in calculatedPrices
    Object.values(calculatedPrices).forEach(price => {
      if (typeof price === 'number') {
        total += price;
      }
    });
    
    setSimulationTotal(total);
  }, [calculatedPrices]);

  const handleSKUSelect = (productId: string, sku: string) => {
    setSelectedSKUs(prev => ({
      ...prev,
      [productId]: sku
    }));
    
    // Recalculate price if quantity already exists
    if (quantities[productId]) {
      calculateTotalPrice(productId, quantities[productId]);
    }
  };

  const handleQuantityChange = (productId: string, quantityValue: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantityValue
    }));
    
    calculateTotalPrice(productId, quantityValue);
  };

  const calculateTotalPrice = (productId: string, quantityValue: string) => {
    const quantity = parseInt(quantityValue, 10);
    const product = productPrices.find(p => p.id === productId);
    
    if (!product || isNaN(quantity) || quantity <= 0) {
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: ""
      }));
      return;
    }
    
    // Check if this product only has price_8000 defined (all other price tiers are NULL or 0)
    const onlyHas8000 = 
      (!product.price_1000 || product.price_1000 === 0) && 
      (!product.price_2000 || product.price_2000 === 0) && 
      (!product.price_3000 || product.price_3000 === 0) && 
      (!product.price_4000 || product.price_4000 === 0) && 
      (!product.price_5000 || product.price_5000 === 0) && 
      (product.price_8000 && product.price_8000 > 0);
    
    // Special case: If product only has price_8000 defined and quantity is not 8000
    if (onlyHas8000 && quantity !== 8000) {
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: "Ce produit doit être commandé en quantité exacte de 8000 unités."
      }));
      return;
    }
    
    // Determine the appropriate price tier based on the quantity
    let tierPrice = 0;
    let tierQuantity = 0;
    
    // Check if quantity exactly matches a tier
    if (quantity === 1000 && product.price_1000) {
      tierPrice = product.price_1000;
      tierQuantity = 1000;
    } else if (quantity === 2000 && product.price_2000) {
      tierPrice = product.price_2000;
      tierQuantity = 2000;
    } else if (quantity === 3000 && product.price_3000) {
      tierPrice = product.price_3000;
      tierQuantity = 3000;
    } else if (quantity === 4000 && product.price_4000) {
      tierPrice = product.price_4000;
      tierQuantity = 4000;
    } else if (quantity === 5000 && product.price_5000) {
      tierPrice = product.price_5000;
      tierQuantity = 5000;
    } else if (quantity === 8000 && product.price_8000) {
      tierPrice = product.price_8000;
      tierQuantity = 8000;
    } else {
      // Quantity doesn't match an exact tier, find the closest lower tier
      
      // Create an array of available tiers for this product
      const availableTiers = [
        { quantity: 1000, price: product.price_1000 || 0 },
        { quantity: 2000, price: product.price_2000 || 0 },
        { quantity: 3000, price: product.price_3000 || 0 },
        { quantity: 4000, price: product.price_4000 || 0 },
        { quantity: 5000, price: product.price_5000 || 0 },
        { quantity: 8000, price: product.price_8000 || 0 }
      ].filter(tier => tier.price > 0);
      
      // Sort tiers by quantity (ascending)
      availableTiers.sort((a, b) => a.quantity - b.quantity);
      
      if (availableTiers.length === 0) {
        // No price tiers defined for this product
        setCalculatedPrices(prev => ({
          ...prev,
          [productId]: "Aucun prix défini pour ce produit"
        }));
        return;
      }
      
      // Case: quantity is lower than the lowest tier
      if (quantity < availableTiers[0].quantity) {
        setCalculatedPrices(prev => ({
          ...prev,
          [productId]: `Quantité minimum: ${availableTiers[0].quantity} unités`
        }));
        return;
      }
      
      // Case: quantity is higher than all available tiers
      if (quantity > availableTiers[availableTiers.length - 1].quantity) {
        // Use the highest tier
        const highestTier = availableTiers[availableTiers.length - 1];
        tierPrice = highestTier.price;
        tierQuantity = highestTier.quantity;
      } else {
        // Find the closest lower tier
        for (let i = availableTiers.length - 1; i >= 0; i--) {
          if (availableTiers[i].quantity <= quantity) {
            tierPrice = availableTiers[i].price;
            tierQuantity = availableTiers[i].quantity;
            break;
          }
        }
      }
    }
    
    // Calculate the total price based on the tier price and the requested quantity
    if (tierPrice > 0) {
      const totalPrice = quantity * tierPrice;
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: totalPrice
      }));
    } else {
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: "Prix non disponible pour cette quantité"
      }));
    }
  };

  // Get the quantity for a specific SKU
  const getQuantityForSKU = (sku: string): string => {
    // Find the product ID that has this SKU selected
    const productId = Object.entries(selectedSKUs).find(([_, selectedSKU]) => selectedSKU === sku)?.[0];
    
    if (productId && quantities[productId]) {
      return quantities[productId];
    }
    
    return '';
  };
  
  // Get the calculated price for a specific SKU
  const getPriceForSKU = (sku: string): number | string => {
    // Find the product ID that has this SKU selected
    const productId = Object.entries(selectedSKUs).find(([_, selectedSKU]) => selectedSKU === sku)?.[0];
    
    if (productId && typeof calculatedPrices[productId] === 'number') {
      return calculatedPrices[productId] as number;
    }
    
    return '';
  };

  return {
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    standardQuantities,
    getQuantityForSKU,
    getPriceForSKU,
    handleSKUSelect,
    handleQuantityChange
  };
}
