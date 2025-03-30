
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
  const { analysisItems, refetch, updateSKUPrices } = useAnalysisItems();
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

  // Function to associate prices with existing SKUs based on exact SKU mapping per product row
  const associatePrices = async () => {
    setIsPriceAssociationLoading(true);
    let updatedCount = 0;
    
    try {
      // Build a mapping of SKUs to product_id for all analysis items with SKU data
      const skuToProductMapping: Record<string, string> = {};
      analysisItems.forEach(item => {
        if (item.sku_code && item.product_id) {
          skuToProductMapping[item.sku_code] = item.product_id;
        }
      });
      
      console.log('SKU to product mapping:', skuToProductMapping);
      
      // Create a mapping of product_id to product_price
      const productIdToPriceMapping: Record<string, any> = {};
      products.forEach(product => {
        // For each product, find the corresponding product price where names are similar
        const skuParts = product.SKU.split('-');
        const productCategory = skuParts[0];
        
        const matchingProductPrice = productPrices.find(p => {
          const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
        });
        
        if (matchingProductPrice) {
          productIdToPriceMapping[product.id] = matchingProductPrice;
        }
      });
      
      console.log('Product ID to price mapping:', productIdToPriceMapping);
      
      // Loop through all items with SKUs
      const itemsToUpdate = analysisItems.filter(item => 
        item.sku_code && 
        (!item.price_1000 && !item.price_2000 && !item.price_3000 && 
        !item.price_4000 && !item.price_5000 && !item.price_8000)
      );
      
      console.log(`Found ${itemsToUpdate.length} analysis items that need price data associated`);
      
      // Prepare the updates list
      const updateList = itemsToUpdate.map(item => {
        if (!item.sku_code || !item.id) return null;
        
        const productId = item.product_id;
        if (!productId) {
          console.warn(`No product ID found for SKU ${item.sku_code}`);
          return null;
        }
        
        const priceInfo = productIdToPriceMapping[productId];
        if (!priceInfo) {
          console.warn(`No price information found for product ID ${productId} (SKU ${item.sku_code})`);
          return null;
        }
        
        console.log(`Updating SKU ${item.sku_code} with prices from product ${priceInfo.product_name}:`, {
          price_1000: priceInfo.price_1000,
          price_2000: priceInfo.price_2000,
          price_3000: priceInfo.price_3000,
          price_4000: priceInfo.price_4000,
          price_5000: priceInfo.price_5000,
          price_8000: priceInfo.price_8000
        });
        
        return {
          id: item.id,
          price_1000: priceInfo.price_1000,
          price_2000: priceInfo.price_2000,
          price_3000: priceInfo.price_3000,
          price_4000: priceInfo.price_4000,
          price_5000: priceInfo.price_5000,
          price_8000: priceInfo.price_8000
        };
      }).filter(Boolean);
      
      console.log('Price updates to be applied:', updateList);
      
      // Update all the prices at once using the updateSKUPrices mutation
      if (updateList.length > 0) {
        // @ts-ignore - TypeScript may complain about the filter
        await updateSKUPrices.mutateAsync(updateList);
        updatedCount = updateList.length;
        
        // Refresh the data
        await refetch();
        setIsPriceAssociationComplete(true);
        
        toast({
          title: "Association des prix réussie",
          description: `${updatedCount} SKUs ont été associés avec leurs prix correspondants.`,
        });
      } else {
        toast({
          title: "Aucune mise à jour effectuée",
          description: "Aucun SKU nécessitant une mise à jour de prix n'a été trouvé.",
          variant: "warning"
        });
      }
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
