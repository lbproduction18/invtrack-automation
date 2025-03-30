
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProductPrices } from '@/hooks/useProductPrices';

export function useBackfillAnalysisItems() {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPriceAssociationLoading, setIsPriceAssociationLoading] = useState(false);
  const [isPriceAssociationComplete, setIsPriceAssociationComplete] = useState(false);
  const { toast } = useToast();
  const { products } = useProducts('all');
  const { analysisItems, refetch } = useAnalysisItems();
  const { productPrices } = useProductPrices();

  // Function to backfill SKU data for existing analysis items (without price data)
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
          // Prepare the update object with SKU data
          const updateObject: any = {
            sku_code: product.SKU,
            sku_label: product.product_name
          };
          
          // Don't add pricing data during backfill - this is now done separately with the associate prices button
          
          // Update the analysis item with the product's SKU data only
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
        description: `${updatedCount} produits en analyse ont été mis à jour avec leurs informations SKU.`,
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

  // Function to associate prices with existing SKUs
  const associatePrices = async () => {
    setIsPriceAssociationLoading(true);
    let updatedCount = 0;
    
    try {
      // Get all analysis items that have SKU data but no price data
      const itemsNeedingPrices = analysisItems.filter(
        item => item.sku_code && (!item.price_1000 && !item.price_2000 && !item.price_3000 && 
               !item.price_4000 && !item.price_5000 && !item.price_8000)
      );
      
      console.log(`Found ${itemsNeedingPrices.length} analysis items that need price data associated`);
      
      for (const item of itemsNeedingPrices) {
        if (item.sku_code) {
          // Extract product category from SKU for pricing lookup
          const skuParts = item.sku_code.split('-');
          const productCategory = skuParts[0];
          
          // Find the corresponding product price by matching product category
          const matchedProductPrice = productPrices.find(p => {
            const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
          });
          
          if (matchedProductPrice) {
            // Prepare the update object with price data
            const updateObject = {
              price_1000: matchedProductPrice.price_1000,
              price_2000: matchedProductPrice.price_2000,
              price_3000: matchedProductPrice.price_3000,
              price_4000: matchedProductPrice.price_4000,
              price_5000: matchedProductPrice.price_5000,
              price_8000: matchedProductPrice.price_8000
            };
            
            // Update the analysis item with price data
            const { error } = await supabase
              .from('analysis_items')
              .update(updateObject)
              .eq('id', item.id);
              
            if (error) {
              console.error(`Error updating price data for item ${item.id}:`, error);
            } else {
              updatedCount++;
            }
          } else {
            console.warn(`No matching product price found for SKU ${item.sku_code}`);
          }
        }
      }
      
      // Refresh the data
      await refetch();
      setIsPriceAssociationComplete(true);
      
      toast({
        title: "Association des prix réussie",
        description: `${updatedCount} SKUs ont été associés avec leurs prix correspondants.`,
      });
    } catch (error) {
      console.error('Error during price association:', error);
      toast({
        title: "Erreur lors de l'association des prix",
        description: "Une erreur s'est produite lors de l'association des prix aux SKUs.",
        variant: "destructive"
      });
    } finally {
      setIsPriceAssociationLoading(false);
    }
  };

  return {
    backfillSKUData,
    associatePrices,
    isLoading,
    isComplete,
    isPriceAssociationLoading,
    isPriceAssociationComplete
  };
}
