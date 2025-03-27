import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

export function useSimulationSKUs(
  selectedSKUs: Record<string, SelectedSKU[]>,
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  productPrices: ProductPrice[]
) {
  const { toast } = useToast();
  const { analysisItems } = useAnalysisItems();
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];

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
      
      // Check if this product has an analysis item
      const analysisItem = analysisItems.find(item => item.product_id === skuInfo.id);
      
      // Default to first quantity option with a price
      let defaultQuantity: QuantityOption = analysisItem?.quantity_selected as QuantityOption || 1000;
      let defaultPrice = 0;
      
      if (productPrice) {
        // If we have an analysis item with quantity, use that
        if (analysisItem?.quantity_selected) {
          const priceField = `price_${analysisItem.quantity_selected}` as keyof typeof productPrice;
          defaultPrice = productPrice[priceField] as number || 0;
        } else {
          // Otherwise try to find the first quantity that has a price
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

  return {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange
  };
}
