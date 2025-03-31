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
      
      const productPrice = productPrices.find(p => {
        const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
      });
      
      console.log("Found product price:", productPrice);
      
      const analysisItem = analysisItems.find(item => item.product_id === skuInfo.id);
      console.log("Found analysis item:", analysisItem);
      
      let defaultQuantity: QuantityOption = analysisItem?.quantity_selected as QuantityOption || 1000;
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
  
  const updateAnalysisItemSKU = async (
    productId: string, 
    skuCode: string, 
    skuLabel: string, 
    productPrice: ProductPrice | undefined
  ) => {
    try {
      const existingItem = analysisItems.find(item => item.product_id === productId);
      
      const dataObject: any = {
        sku_code: skuCode,
        sku_label: skuLabel
      };
      
      if (productPrice) {
        dataObject.price_1000 = productPrice.price_1000;
        dataObject.price_2000 = productPrice.price_2000;
        dataObject.price_3000 = productPrice.price_3000;
        dataObject.price_4000 = productPrice.price_4000;
        dataObject.price_5000 = productPrice.price_5000;
        dataObject.price_8000 = productPrice.price_8000;
      }
      
      if (existingItem) {
        await updateAnalysisItem.mutateAsync({
          id: existingItem.id,
          data: dataObject
        });
        console.log(`Successfully updated SKU and pricing for product ${productId}`);
      } else {
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
  
  const handleRemoveSKU = (productName: string, skuIndex: number) => {
    console.log(`Removing SKU - Product: ${productName}, Index: ${skuIndex}`);
    
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      const skuToRemove = updatedSKUs[skuIndex];
      if (skuToRemove && skuToRemove.productId) {
        clearAnalysisItemSKU(skuToRemove.productId);
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
  
  const clearAnalysisItemSKU = async (productId: string) => {
    try {
      const analysisItem = analysisItems.find(item => item.product_id === productId);
      if (analysisItem) {
        await updateAnalysisItem.mutateAsync({
          id: analysisItem.id,
          data: {
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
  
  const handleQuantityChange = (productName: string, skuIndex: number, quantity: QuantityOption) => {
    console.log(`Changing quantity - Product: ${productName}, Index: ${skuIndex}, Quantity: ${quantity}`);
    
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      if (updatedSKUs[skuIndex]) {
        const sku = updatedSKUs[skuIndex];
        
        const skuParts = sku.SKU.split('-');
        const productCategory = skuParts[0];
        
        const productPrice = productPrices.find(p => {
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
  
  const updateAnalysisItemQuantity = async (
    productId: string, 
    quantity: number, 
    productPrice: ProductPrice | undefined
  ) => {
    try {
      const dataObject: any = { 
        quantity_selected: quantity 
      };
      
      const analysisItem = analysisItems.find(item => item.product_id === productId);
      if (analysisItem) {
        await updateAnalysisItem.mutateAsync({
          id: analysisItem.id,
          data: dataObject
        });
        console.log(`Successfully updated quantity to ${quantity} for product ${productId}`);
      } else {
        const insertObject = {
          product_id: productId,
          quantity_selected: quantity
        };
        
        const product = await supabase
          .from('Low stock product')
          .select('SKU, product_name')
          .eq('id', productId)
          .single();
          
        if (product.data) {
          insertObject['sku_code'] = product.data.SKU;
          insertObject['sku_label'] = product.data.product_name;
          
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
