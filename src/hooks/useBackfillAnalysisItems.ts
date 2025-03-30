
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProductPrices } from '@/hooks/useProductPrices';

export function useBackfillAnalysisItems() {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { products } = useProducts('all');
  const { analysisItems, refetch } = useAnalysisItems();
  const { productPrices } = useProductPrices();

  // Function to backfill SKU data for existing analysis items
  const backfillSKUData = async () => {
    setIsLoading(true);
    let updatedCount = 0;
    
    try {
      // Get all analysis items that are missing SKU data
      const itemsNeedingUpdate = analysisItems.filter(
        item => item.product_id && (!item.sku_code || !item.sku_label)
      );
      
      console.log(`Found ${itemsNeedingUpdate.length} analysis items that need SKU data backfilled`);
      
      for (const item of itemsNeedingUpdate) {
        // Find the corresponding product
        const product = products.find(p => p.id === item.product_id);
        
        if (product) {
          // Find the corresponding product price by matching product category from SKU
          let matchedProductPrice = null;
          
          if (product.SKU) {
            const skuParts = product.SKU.split('-');
            const productCategory = skuParts[0];
            
            matchedProductPrice = productPrices.find(p => {
              const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
              const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
              return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
            });
          }
          
          // Prepare the update object with SKU data
          const updateObject: any = {
            sku_code: product.SKU,
            sku_label: product.product_name
          };
          
          // Add pricing data if available
          if (matchedProductPrice) {
            updateObject.price_1000 = matchedProductPrice.price_1000;
            updateObject.price_2000 = matchedProductPrice.price_2000;
            updateObject.price_3000 = matchedProductPrice.price_3000;
            updateObject.price_4000 = matchedProductPrice.price_4000;
            updateObject.price_5000 = matchedProductPrice.price_5000;
            updateObject.price_8000 = matchedProductPrice.price_8000;
          }
          
          // Update the analysis item with the product's SKU and pricing data
          const { error } = await supabase
            .from('analysis_items')
            .update(updateObject)
            .eq('id', item.id);
            
          if (error) {
            console.error(`Error updating analysis item ${item.id}:`, error);
          } else {
            updatedCount++;
          }
        } else {
          console.warn(`No product found for analysis item ${item.id} with product_id ${item.product_id}`);
        }
      }
      
      // Refresh the data
      await refetch();
      setIsComplete(true);
      
      toast({
        title: "Mise à jour réussie",
        description: `${updatedCount} produits en analyse ont été mis à jour avec leurs informations SKU et de prix.`,
      });
    } catch (error) {
      console.error('Error during backfill operation:', error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: "Une erreur s'est produite lors de la mise à jour des données SKU.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    backfillSKUData,
    isLoading,
    isComplete
  };
}
