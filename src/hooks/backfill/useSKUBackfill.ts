
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

export function useSKUBackfill() {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { products } = useProducts('all');
  const { analysisItems, refetch } = useAnalysisItems();

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

  return {
    backfillSKUData,
    isLoading,
    isComplete
  };
}
