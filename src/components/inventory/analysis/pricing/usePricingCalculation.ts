
import { useState, useEffect } from 'react';
import { ProductPrice } from '@/hooks/useProductPrices';
import { useToast } from '@/hooks/use-toast';
import { type SelectedSKU } from '@/types/product';

/**
 * Hook to handle pricing calculations for the pricing grid
 */
export function usePricingCalculation(productPrices: ProductPrice[]) {
  const { toast } = useToast();
  const [selectedSKUs, setSelectedSKUs] = useState<Record<string, SelectedSKU[]>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number | string>>({});
  const [simulationTotal, setSimulationTotal] = useState<number>(0);

  // Standard quantities that match price columns
  const standardQuantities = [1000, 2000, 3000, 4000, 5000, 8000];

  // Calculate the total simulation amount whenever selectedSKUs change
  useEffect(() => {
    let total = 0;
    
    // Sum up all the SKUs in the simulation
    Object.values(selectedSKUs).forEach(skuArray => {
      skuArray.forEach(sku => {
        total += sku.quantity * sku.price;
      });
    });
    
    setSimulationTotal(total);
  }, [selectedSKUs]);

  const handleSKUSelect = (productId: string, sku: string, skuProductId: string) => {
    // Find the product price for this row
    const product = productPrices.find(p => p.id === productId);
    if (!product) return;
    
    // Check if we already have this SKU in any product
    const skuExists = Object.values(selectedSKUs).some(skuArray => 
      skuArray.some(selectedSku => selectedSku.SKU === sku)
    );
    
    if (skuExists) {
      toast({
        title: "SKU déjà sélectionné",
        description: "Ce SKU est déjà dans la simulation.",
        variant: "destructive",
      });
      return;
    }
    
    // Get the current quantity for this product row
    const quantityStr = quantities[productId] || "1000";
    const quantity = parseInt(quantityStr, 10);
    
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Quantité invalide",
        description: "Veuillez saisir une quantité valide.",
        variant: "destructive",
      });
      return;
    }
    
    // Find the appropriate price based on quantity
    let price = 0;
    if (quantity === 1000 && product.price_1000) price = product.price_1000;
    else if (quantity === 2000 && product.price_2000) price = product.price_2000;
    else if (quantity === 3000 && product.price_3000) price = product.price_3000;
    else if (quantity === 4000 && product.price_4000) price = product.price_4000;
    else if (quantity === 5000 && product.price_5000) price = product.price_5000;
    else if (quantity === 8000 && product.price_8000) price = product.price_8000;
    
    // Add the new SKU to the product's array
    setSelectedSKUs(prev => {
      const productSKUs = prev[productId] || [];
      return {
        ...prev,
        [productId]: [
          ...productSKUs,
          {
            productId: skuProductId,
            SKU: sku,
            quantity,
            price,
            productName: product.product_name
          }
        ]
      };
    });
    
    // Recalculate price for the product row
    calculateTotalPriceForProduct(productId);
  };

  const handleQuantityChange = (productId: string, quantityValue: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantityValue
    }));
    
    // Update quantities for all SKUs in this product
    const quantity = parseInt(quantityValue, 10);
    if (!isNaN(quantity) && quantity > 0) {
      const product = productPrices.find(p => p.id === productId);
      if (!product) return;
      
      let tierPrice = 0;
      if (quantity === 1000 && product.price_1000) tierPrice = product.price_1000;
      else if (quantity === 2000 && product.price_2000) tierPrice = product.price_2000;
      else if (quantity === 3000 && product.price_3000) tierPrice = product.price_3000;
      else if (quantity === 4000 && product.price_4000) tierPrice = product.price_4000;
      else if (quantity === 5000 && product.price_5000) tierPrice = product.price_5000;
      else if (quantity === 8000 && product.price_8000) tierPrice = product.price_8000;
      
      // Update all SKUs for this product with the new quantity and price
      setSelectedSKUs(prev => {
        const productSKUs = prev[productId] || [];
        if (productSKUs.length === 0) return prev;
        
        return {
          ...prev,
          [productId]: productSKUs.map(sku => ({
            ...sku,
            quantity,
            price: tierPrice
          }))
        };
      });
    }
    
    calculateTotalPriceForProduct(productId);
  };
  
  const removeSKU = (productId: string, skuToRemove: string) => {
    setSelectedSKUs(prev => {
      const productSKUs = prev[productId] || [];
      const updatedSKUs = productSKUs.filter(sku => sku.SKU !== skuToRemove);
      
      // If there are no more SKUs for this product, remove the product key
      if (updatedSKUs.length === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [productId]: updatedSKUs
      };
    });
    
    calculateTotalPriceForProduct(productId);
  };

  const calculateTotalPriceForProduct = (productId: string) => {
    const product = productPrices.find(p => p.id === productId);
    if (!product) return;
    
    const productSKUs = selectedSKUs[productId] || [];
    if (productSKUs.length === 0) {
      setCalculatedPrices(prev => ({
        ...prev,
        [productId]: ""
      }));
      return;
    }
    
    // Calculate the total price for all SKUs in this product
    const totalPrice = productSKUs.reduce((sum, sku) => sum + (sku.quantity * sku.price), 0);
    setCalculatedPrices(prev => ({
      ...prev,
      [productId]: totalPrice
    }));
  };

  // Get the quantity for a specific SKU
  const getQuantityForSKU = (sku: string): string => {
    // Find the product and SKU that match
    for (const [productId, skuArray] of Object.entries(selectedSKUs)) {
      const foundSku = skuArray.find(s => s.SKU === sku);
      if (foundSku) {
        return foundSku.quantity.toString();
      }
    }
    
    return '';
  };
  
  // Get the calculated price for a specific SKU
  const getPriceForSKU = (sku: string): number | string => {
    // Find the product and SKU that match
    for (const [productId, skuArray] of Object.entries(selectedSKUs)) {
      const foundSku = skuArray.find(s => s.SKU === sku);
      if (foundSku) {
        return foundSku.quantity * foundSku.price;
      }
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
    handleQuantityChange,
    removeSKU
  };
}
