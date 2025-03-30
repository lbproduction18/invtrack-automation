
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { supabase } from '@/integrations/supabase/client';

export function useSimulationSKUs(
  selectedSKUs: Record<string, SelectedSKU[]>,
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  productPrices: ProductPrice[]
) {
  const { toast } = useToast();
  const { analysisItems, updateAnalysisItem } = useAnalysisItems();
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];

  useEffect(() => {
    console.log("Current selected SKUs:", selectedSKUs);
  }, [selectedSKUs]);

  // Add a SKU to a product row
  const handleAddSKU = (productName: string, skuInfo: { id: string, SKU: string, productName: string | null }) => {
    console.log(`Adding SKU - Product: ${productName}, SKU:`, skuInfo);
    
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
      
      // Extract product category from SKU for pricing lookup
      // For example, if SKU is "COLLAGENE-LOTUS", we want "COLLAGENE" for price lookup
      const skuParts = skuInfo.SKU.split('-');
      const productCategory = skuParts[0];
      
      console.log(`Looking for price for product category: ${productCategory}`);
      
      // Find the matching product price for this product category
      const productPrice = productPrices.find(p => {
        // Case insensitive comparison and normalize accents
        const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
      });
      
      console.log("Found product price:", productPrice);
      
      // Check if this product has an analysis item
      const analysisItem = analysisItems.find(item => item.product_id === skuInfo.id);
      console.log("Found analysis item:", analysisItem);
      
      // Default to first quantity option with a price
      let defaultQuantity: QuantityOption = analysisItem?.quantity_selected as QuantityOption || 1000;
      let defaultPrice = 0;
      
      if (productPrice) {
        // If we have an analysis item with quantity, use that
        if (analysisItem?.quantity_selected) {
          const priceField = `price_${analysisItem.quantity_selected}` as keyof typeof productPrice;
          defaultPrice = productPrice[priceField] as number || 0;
          console.log(`Using quantity ${analysisItem.quantity_selected} with price ${defaultPrice}`);
        } else {
          // Otherwise try to find the first quantity that has a price
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
      
      // Now update the analysis_item with SKU information and pricing data
      updateAnalysisItemSKU(skuInfo.id, skuInfo.SKU, skuInfo.productName || '', productPrice);
      
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
  
  // Update the analysis_items record with SKU information and pricing data
  const updateAnalysisItemSKU = async (
    productId: string, 
    skuCode: string, 
    skuLabel: string, 
    productPrice: ProductPrice | undefined
  ) => {
    try {
      // First, check if an analysis item exists for this product
      const existingItem = analysisItems.find(item => item.product_id === productId);
      
      // Prepare the update/insert object with SKU information
      const dataObject: any = {
        sku_code: skuCode,
        sku_label: skuLabel
      };
      
      // Add pricing data if available
      if (productPrice) {
        dataObject.price_1000 = productPrice.price_1000;
        dataObject.price_2000 = productPrice.price_2000;
        dataObject.price_3000 = productPrice.price_3000;
        dataObject.price_4000 = productPrice.price_4000;
        dataObject.price_5000 = productPrice.price_5000;
        dataObject.price_8000 = productPrice.price_8000;
      }
      
      if (existingItem) {
        // If the item exists, update it
        await updateAnalysisItem.mutateAsync({
          id: existingItem.id,
          updates: dataObject
        });
        console.log(`Successfully updated SKU and pricing for product ${productId}`);
      } else {
        // If the item doesn't exist, create a new one
        const insertObject = {
          product_id: productId,
          ...dataObject
        };
        
        const { data, error } = await supabase
          .from('analysis_items')
          .insert([insertObject])
          .select();
          
        if (error) {
          console.error('Error inserting new analysis item:', error);
          throw error;
        }
        
        console.log(`Successfully created new analysis item for product ${productId}`, data);
      }
    } catch (err) {
      console.error('Exception updating SKU in analysis_items:', err);
    }
  };
  
  // Remove a SKU from a product row
  const handleRemoveSKU = (productName: string, skuIndex: number) => {
    console.log(`Removing SKU - Product: ${productName}, Index: ${skuIndex}`);
    
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      // Get the productId before removing it
      const skuToRemove = updatedSKUs[skuIndex];
      if (skuToRemove && skuToRemove.productId) {
        // Clear the SKU information in the analysis_items table
        clearAnalysisItemSKU(skuToRemove.productId);
      }
      
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
  
  // Clear SKU information from an analysis_item
  const clearAnalysisItemSKU = async (productId: string) => {
    try {
      const analysisItem = analysisItems.find(item => item.product_id === productId);
      if (analysisItem) {
        await updateAnalysisItem.mutateAsync({
          id: analysisItem.id,
          updates: {
            sku_code: null,
            sku_label: null
          }
        });
        console.log(`Successfully cleared SKU for product ${productId}`);
      } else {
        console.warn(`No analysis item found for product ${productId}`);
      }
    } catch (err) {
      console.error('Exception clearing SKU in analysis_items:', err);
    }
  };
  
  // Handle quantity change for a SKU
  const handleQuantityChange = (productName: string, skuIndex: number, quantity: QuantityOption) => {
    console.log(`Changing quantity - Product: ${productName}, Index: ${skuIndex}, Quantity: ${quantity}`);
    
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      if (updatedSKUs[skuIndex]) {
        const sku = updatedSKUs[skuIndex];
        
        // Extract product category from SKU for pricing lookup
        const skuParts = sku.SKU.split('-');
        const productCategory = skuParts[0];
        
        // Find the matching product price for this product category
        const productPrice = productPrices.find(p => {
          // Case insensitive comparison and normalize accents
          const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
        });
        
        const priceField = `price_${quantity}` as keyof typeof productPrice;
        const price = productPrice ? (productPrice[priceField] as number || 0) : 0;
        
        console.log(`Found price ${price} for quantity ${quantity}`);
        
        updatedSKUs[skuIndex] = {
          ...updatedSKUs[skuIndex],
          quantity,
          price
        };
        
        // Update quantity in analysis_items
        if (sku.productId) {
          updateAnalysisItemQuantity(sku.productId, quantity, productPrice);
        }
      }
      
      return {
        ...prev,
        [productName]: updatedSKUs
      };
    });
  };
  
  // Update the quantity in the analysis_items table
  const updateAnalysisItemQuantity = async (
    productId: string, 
    quantity: number, 
    productPrice: ProductPrice | undefined
  ) => {
    try {
      // Prepare the update object with quantity
      const dataObject: any = { 
        quantity_selected: quantity 
      };
      
      const analysisItem = analysisItems.find(item => item.product_id === productId);
      if (analysisItem) {
        await updateAnalysisItem.mutateAsync({
          id: analysisItem.id,
          updates: dataObject
        });
        console.log(`Successfully updated quantity to ${quantity} for product ${productId}`);
      } else {
        // If no analysis item exists, create one
        const insertObject = {
          product_id: productId,
          quantity_selected: quantity
        };
        
        // Add SKU data if available
        const product = await supabase
          .from('Low stock product')
          .select('SKU, product_name')
          .eq('id', productId)
          .single();
          
        if (product.data) {
          insertObject['sku_code'] = product.data.SKU;
          insertObject['sku_label'] = product.data.product_name;
          
          // Add pricing data if available
          if (productPrice) {
            insertObject['price_1000'] = productPrice.price_1000;
            insertObject['price_2000'] = productPrice.price_2000;
            insertObject['price_3000'] = productPrice.price_3000;
            insertObject['price_4000'] = productPrice.price_4000;
            insertObject['price_5000'] = productPrice.price_5000;
            insertObject['price_8000'] = productPrice.price_8000;
          }
        }
        
        const { error } = await supabase
          .from('analysis_items')
          .insert([insertObject]);
          
        if (error) {
          console.error('Error creating analysis item:', error);
          throw error;
        }
        
        console.log(`Successfully created new analysis item with quantity ${quantity} for product ${productId}`);
      }
    } catch (err) {
      console.error('Exception updating quantity in analysis_items:', err);
    }
  };

  return {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange
  };
}
