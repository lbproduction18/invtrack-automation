
import { useState } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { hasOnlyPrice8000, findPriceTierForQuantity } from '../utils/pricingUtils';
import { useQuantityUpdate } from './useQuantityUpdate';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to manage price calculations
 */
export function usePriceCalculation(productPrices: ProductPrice[]) {
  const { toast } = useToast();
  // Change to store quantities per SKU
  const [quantities, setQuantities] = useState<Record<string, Record<string, string>>>({});
  // Change to store calculated prices per SKU
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, Record<string, number | string>>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);
  const { updateAnalysisItemQuantity } = useQuantityUpdate();

  /**
   * Calculate the total price for a specific SKU based on the selected quantity
   */
  const calculateTotalPrice = (productId: string, sku: string, quantityValue: string) => {
    const quantity = parseInt(quantityValue, 10);
    const product = productPrices.find(p => p.id === productId);
    
    if (!product || isNaN(quantity) || quantity <= 0) {
      setCalculatedPrices(prev => {
        const productPrices = prev[productId] || {};
        return {
          ...prev,
          [productId]: {
            ...productPrices,
            [sku]: ""
          }
        };
      });
      return;
    }
    
    // Check if this product only has price_8000 defined
    const onlyHas8000 = hasOnlyPrice8000(product);
    
    // Special case: If product only has price_8000 defined and quantity is not 8000
    if (onlyHas8000 && quantity !== 8000) {
      setCalculatedPrices(prev => {
        const productPrices = prev[productId] || {};
        return {
          ...prev,
          [productId]: {
            ...productPrices,
            [sku]: "Ce produit doit être commandé en quantité exacte de 8000 unités."
          }
        };
      });
      return;
    }
    
    // Find the appropriate price tier
    const { tierPrice, message } = findPriceTierForQuantity(product, quantity);
    
    // If we have a message instead of a price, display it
    if (message) {
      setCalculatedPrices(prev => {
        const productPrices = prev[productId] || {};
        return {
          ...prev,
          [productId]: {
            ...productPrices,
            [sku]: message
          }
        };
      });
      return;
    }
    
    // Calculate the total price based on the tier price and the requested quantity
    if (tierPrice > 0) {
      const totalPrice = quantity * tierPrice;
      setCalculatedPrices(prev => {
        const productPrices = prev[productId] || {};
        return {
          ...prev,
          [productId]: {
            ...productPrices,
            [sku]: totalPrice
          }
        };
      });
    } else {
      setCalculatedPrices(prev => {
        const productPrices = prev[productId] || {};
        return {
          ...prev,
          [productId]: {
            ...productPrices,
            [sku]: "Prix non disponible pour cette quantité"
          }
        };
      });
    }
  };

  /**
   * Clear price data for a specific SKU
   */
  const clearPriceDataForSKU = (productId: string, sku: string) => {
    // Clear quantity data
    setQuantities(prev => {
      const newQuantities = { ...prev };
      if (newQuantities[productId]) {
        const productQuantities = { ...newQuantities[productId] };
        delete productQuantities[sku];
        
        if (Object.keys(productQuantities).length === 0) {
          delete newQuantities[productId];
        } else {
          newQuantities[productId] = productQuantities;
        }
      }
      return newQuantities;
    });
    
    // Clear calculated price data
    setCalculatedPrices(prev => {
      const newPrices = { ...prev };
      if (newPrices[productId]) {
        const productPrices = { ...newPrices[productId] };
        delete productPrices[sku];
        
        if (Object.keys(productPrices).length === 0) {
          delete newPrices[productId];
        } else {
          newPrices[productId] = productPrices;
        }
      }
      return newPrices;
    });
    
    // Notify the user
    toast({
      title: "Produit supprimé",
      description: `${sku} a été retiré de la simulation.`,
      variant: "default"
    });
  };

  /**
   * Update quantity for a specific SKU of a product
   */
  const handleQuantityChange = async (productId: string, sku: string, quantityValue: string) => {
    setQuantities(prev => {
      const productQuantities = prev[productId] || {};
      
      return {
        ...prev,
        [productId]: {
          ...productQuantities,
          [sku]: quantityValue
        }
      };
    });
    
    calculateTotalPrice(productId, sku, quantityValue);
    
    // Update quantity in Supabase
    const quantity = parseInt(quantityValue, 10);
    if (!isNaN(quantity) && quantity > 0) {
      await updateAnalysisItemQuantity(productId, quantity);
    }
  };

  /**
   * Get the quantity for a specific SKU
   */
  const getQuantityForSKU = (sku: string, selectedSKUs: Record<string, string[]>): string => {
    // Find the product ID that has this SKU selected
    for (const [productId, skus] of Object.entries(selectedSKUs)) {
      if (skus.includes(sku) && quantities[productId] && quantities[productId][sku]) {
        return quantities[productId][sku];
      }
    }
    return '';
  };
  
  /**
   * Get the calculated price for a specific SKU
   */
  const getPriceForSKU = (sku: string, selectedSKUs: Record<string, string[]>): number | string => {
    // Find the product ID that has this SKU selected
    for (const [productId, skus] of Object.entries(selectedSKUs)) {
      if (skus.includes(sku) && calculatedPrices[productId] && typeof calculatedPrices[productId][sku] === 'number') {
        return calculatedPrices[productId][sku] as number;
      }
    }
    return '';
  };
  
  /**
   * Get the unit price for a specific SKU based on the selected quantity
   */
  const getUnitPriceForSKU = (productId: string, sku: string): number => {
    const product = productPrices.find(p => p.id === productId);
    const quantityValue = quantities[productId]?.[sku] || '0';
    const quantity = parseInt(quantityValue, 10);
    
    if (!product || isNaN(quantity) || quantity <= 0) {
      return 0;
    }
    
    // Find the appropriate price tier
    const { tierPrice } = findPriceTierForQuantity(product, quantity);
    return tierPrice;
  };

  /**
   * Calculate the total price for a specific product (sum of all SKUs in that product row)
   */
  const getTotalForProduct = (productId: string): number => {
    if (!calculatedPrices[productId]) {
      return 0;
    }
    
    let total = 0;
    
    Object.values(calculatedPrices[productId]).forEach(price => {
      if (typeof price === 'number') {
        total += price;
      }
    });
    
    return total;
  };

  return {
    quantities,
    calculatedPrices,
    simulationTotal,
    setSimulationTotal,
    getQuantityForSKU,
    getPriceForSKU,
    getTotalForProduct,
    handleQuantityChange,
    calculateTotalPrice,
    getUnitPriceForSKU,
    clearPriceDataForSKU
  };
}
