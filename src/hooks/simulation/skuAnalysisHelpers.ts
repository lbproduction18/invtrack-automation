
import { supabase } from '@/integrations/supabase/client';
import { type ProductPrice } from '@/hooks/useProductPrices';

/**
 * Updates SKU information in an analysis item
 */
export async function updateAnalysisItemSKU(
  productId: string, 
  skuCode: string, 
  skuLabel: string, 
  productPrice: ProductPrice | undefined,
  updateAnalysisItem: any,
  analysisItems: any[]
) {
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
}

/**
 * Clears SKU data from an analysis item
 */
export async function clearAnalysisItemSKU(
  productId: string,
  analysisItems: any[],
  updateAnalysisItem: any
) {
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
}

/**
 * Updates quantity information in an analysis item
 */
export async function updateAnalysisItemQuantity(
  productId: string, 
  quantity: number, 
  productPrice: ProductPrice | undefined,
  analysisItems: any[]
) {
  try {
    const dataObject: any = { 
      quantity_selected: quantity 
    };
    
    const analysisItem = analysisItems.find(item => item.product_id === productId);
    if (analysisItem) {
      // Use the hook's updateAnalysisItem function
      await supabase
        .from('analysis_items')
        .update(dataObject)
        .eq('id', analysisItem.id);
        
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
}
