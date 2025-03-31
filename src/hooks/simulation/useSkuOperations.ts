
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type SelectedSKU } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

/**
 * Hook for adding SKUs to the simulation
 */
export function useSkuAddition(
  selectedSKUs: Record<string, SelectedSKU[]>,
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  productPrices: ProductPrice[],
  quantityOptions: number[]
) {
  const { toast } = useToast();
  const { analysisItems, updateAnalysisItem } = useAnalysisItems();

  const handleAddSKU = (productName: string, skuInfo: { id: string, SKU: string, productName: string | null }) => {
    console.log(`Adding SKU - Product: ${productName}, SKU:`, skuInfo);
    
    setSelectedSKUs(prev => {
      const currentSKUs = prev[productName] || [];
      
      const isAlreadyAdded = currentSKUs.some(sku => sku.SKU === skuInfo.SKU);
      if (isAlreadyAdded) {
        toast({
          title: "SKU déjà ajouté",
          description: `${skuInfo.SKU} est déjà dans la liste.`,
          variant: "destructive"
        });
        return prev;
      }
      
      const skuParts = skuInfo.SKU.split('-');
      const productCategory = skuParts[0];
      
      console.log(`Looking for price for product category: ${productCategory}`);
      
      const productPrice = findMatchingProductPrice(productCategory, productPrices);
      
      console.log("Found product price:", productPrice);
      
      const analysisItem = analysisItems.find(item => item.product_id === skuInfo.id);
      console.log("Found analysis item:", analysisItem);
      
      let defaultQuantity = analysisItem?.quantity_selected || 1000;
      let defaultPrice = 0;
      
      if (productPrice) {
        if (analysisItem?.quantity_selected) {
          const priceField = `price_${analysisItem.quantity_selected}` as keyof typeof productPrice;
          defaultPrice = productPrice[priceField] as number || 0;
          console.log(`Using quantity ${analysisItem.quantity_selected} with price ${defaultPrice}`);
        } else {
          for (const qty of quantityOptions) {
            const priceField = `price_${qty}` as keyof typeof productPrice;
            const price = productPrice[priceField] as number;
            if (price && price > 0) {
              defaultQuantity = qty;
              defaultPrice = price;
              console.log(`Found price ${price} for quantity ${qty}`);
              break;
            }
          }
        }
      }
      
      console.log(`Adding SKU with default quantity ${defaultQuantity} and price ${defaultPrice}`);
      
      updateAnalysisItemSKU(skuInfo.id, skuInfo.SKU, skuInfo.productName || '', productPrice, updateAnalysisItem, analysisItems);
      
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

  return { handleAddSKU };
}

/**
 * Hook for removing SKUs from the simulation
 */
export function useSkuRemoval(
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  analysisItems: any[],
  updateAnalysisItem: any
) {
  const handleRemoveSKU = (productName: string, skuIndex: number) => {
    console.log(`Removing SKU - Product: ${productName}, Index: ${skuIndex}`);
    
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      const skuToRemove = updatedSKUs[skuIndex];
      if (skuToRemove && skuToRemove.productId) {
        clearAnalysisItemSKU(skuToRemove.productId, analysisItems, updateAnalysisItem);
      }
      
      updatedSKUs.splice(skuIndex, 1);
      
      const updatedSelection = {
        ...prev,
        [productName]: updatedSKUs
      };
      
      if (updatedSKUs.length === 0) {
        delete updatedSelection[productName];
      }
      
      return updatedSelection;
    });
  };

  return { handleRemoveSKU };
}

/**
 * Helper function to find matching product price by category
 */
function findMatchingProductPrice(productCategory: string, productPrices: ProductPrice[]): ProductPrice | undefined {
  return productPrices.find(p => {
    const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
  });
}

export default { useSkuAddition, useSkuRemoval };
