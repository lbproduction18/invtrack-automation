
import { useState, useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to handle pricing calculations for the pricing grid
 */
export function usePricingCalculation(productPrices: ProductPrice[]) {
  const { toast } = useToast();
  // Change from Record<string, string> to Record<string, string[]>
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, string[]>>({});
  // Change to store quantities per SKU
  const [quantities, setQuantities] = useState<Record<string, Record<string, string>>>({});
  // Change to store calculated prices per SKU
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, Record<string, number | string>>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  // Standard quantities that match price columns
  const standardQuantities = [1000, 2000, 3000, 4000, 5000, 8000];

  // Calculate the total simulation amount whenever calculatedPrices change
  useEffect(() => {
    let total = 0;
    
    // Sum up all the numeric values in calculatedPrices
    Object.keys(calculatedPrices).forEach(productId => {
      Object.values(calculatedPrices[productId] || {}).forEach(price => {
        if (typeof price === 'number') {
          total += price;
        }
      });
    });
    
    setSimulationTotal(total);
  }, [calculatedPrices]);

  // Add a SKU to a product's selection
  const handleSKUSelect = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      // Get the current SKUs for this product or initialize an empty array
      const currentSKUs = prev[productId] || [];
      
      // Check if this SKU is already in the list
      if (currentSKUs.includes(sku)) {
        return prev;
      }
      
      // Add the new SKU to the list
      return {
        ...prev,
        [productId]: [...currentSKUs, sku]
      };
    });
  };

  // Remove a SKU from a product's selection
  const handleSKURemove = (productId: string, sku: string) => {
    setSelectedSKUs(prev => {
      const currentSKUs = prev[productId] || [];
      const updatedSKUs = currentSKUs.filter(s => s !== sku);
      
      // If there are no SKUs left, remove the product from the map
      if (updatedSKUs.length === 0) {
        const newSelectedSKUs = { ...prev };
        delete newSelectedSKUs[productId];
        return newSelectedSKUs;
      }
      
      return {
        ...prev,
        [productId]: updatedSKUs
      };
    });
    
    // Also remove quantity and price for this SKU
    setQuantities(prev => {
      const newQuantities = { ...prev };
      if (newQuantities[productId]) {
        const productQuantities = { ...newQuantities[productId] };
        delete productQuantities[sku];
        newQuantities[productId] = productQuantities;
      }
      return newQuantities;
    });
    
    setCalculatedPrices(prev => {
      const newPrices = { ...prev };
      if (newPrices[productId]) {
        const productPrices = { ...newPrices[productId] };
        delete productPrices[sku];
        newPrices[productId] = productPrices;
      }
      return newPrices;
    });
  };

  // Update the analysis_items table in Supabase with the quantity
  const updateAnalysisItemQuantity = async (productId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('analysis_items')
        .update({ quantity_selected: quantity })
        .eq('product_id', productId);

      if (error) {
        console.error('Error updating quantity in Supabase:', error);
        toast({
          title: "Erreur de mise à jour",
          description: "La quantité n'a pas pu être sauvegardée. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exception when updating quantity:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la quantité.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update quantity for a specific SKU of a product
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

  // Calculate the total price for a specific SKU based on the selected quantity
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
        setCalculatedPrices(prev => {
          const productPrices = prev[productId] || {};
          return {
            ...prev,
            [productId]: {
              ...productPrices,
              [sku]: "Aucun prix défini pour ce produit"
            }
          };
        });
        return;
      }
      
      // Case: quantity is lower than the lowest tier
      if (quantity < availableTiers[0].quantity) {
        setCalculatedPrices(prev => {
          const productPrices = prev[productId] || {};
          return {
            ...prev,
            [productId]: {
              ...productPrices,
              [sku]: `Quantité minimum: ${availableTiers[0].quantity} unités`
            }
          };
        });
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

  // Get the quantity for a specific SKU
  const getQuantityForSKU = (sku: string): string => {
    // Find the product ID that has this SKU selected
    for (const [productId, skus] of Object.entries(selectedSKUs)) {
      if (skus.includes(sku) && quantities[productId] && quantities[productId][sku]) {
        return quantities[productId][sku];
      }
    }
    return '';
  };
  
  // Get the calculated price for a specific SKU
  const getPriceForSKU = (sku: string): number | string => {
    // Find the product ID that has this SKU selected
    for (const [productId, skus] of Object.entries(selectedSKUs)) {
      if (skus.includes(sku) && calculatedPrices[productId] && typeof calculatedPrices[productId][sku] === 'number') {
        return calculatedPrices[productId][sku] as number;
      }
    }
    return '';
  };

  // Calculate the total price for a specific product (sum of all SKUs in that product row)
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
    selectedSKUs,
    quantities,
    calculatedPrices,
    simulationTotal,
    standardQuantities,
    getQuantityForSKU,
    getPriceForSKU,
    getTotalForProduct,
    handleSKUSelect,
    handleSKURemove,
    handleQuantityChange
  };
}
