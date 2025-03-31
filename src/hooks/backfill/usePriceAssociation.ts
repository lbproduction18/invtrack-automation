
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';

export function usePriceAssociation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { products } = useProducts('all');
  const { analysisItems, refetch, updateSKUPrices } = useAnalysisItems();

  // Function to associate prices with existing SKUs based on the product_id of each analysis item
  const associatePrices = async () => {
    setIsLoading(true);
    let updatedCount = 0;
    
    try {
      // Get items with SKUs but without prices
      const itemsToUpdate = analysisItems.filter(item => 
        item.sku_code && item.product_id && 
        (!item.price_1000 && !item.price_2000 && !item.price_3000 && 
        !item.price_4000 && !item.price_5000 && !item.price_8000)
      );
      
      console.log(`Found ${itemsToUpdate.length} analysis items that need price data associated`);
      
      // Prepare the updates list
      const updateList = itemsToUpdate.map(item => {
        if (!item.product_id || !item.id) return null;
        
        // Find the product price data for this specific product ID
        const product = products.find(p => p.id === item.product_id);
        if (!product) {
          console.warn(`No product found for ID ${item.product_id}`);
          return null;
        }
        
        console.log(`Updating SKU ${item.sku_code} with prices from product ${product.product_name}:`, {
          price_1000: product.price_1000,
          price_2000: product.price_2000,
          price_3000: product.price_3000,
          price_4000: product.price_4000,
          price_5000: product.price_5000,
          price_8000: product.price_8000 // Support price_8000 if available
        });
        
        return {
          id: item.id,
          price_1000: product.price_1000,
          price_2000: product.price_2000,
          price_3000: product.price_3000,
          price_4000: product.price_4000,
          price_5000: product.price_5000,
          price_8000: product.price_8000
        };
      }).filter(Boolean);
      
      console.log('Price updates to be applied:', updateList);
      
      // Update all the prices at once
      if (updateList.length > 0) {
        // @ts-ignore - TypeScript may complain about the filter
        await updateSKUPrices.mutateAsync(updateList);
        updatedCount = updateList.length;
        
        // Refresh the data
        await refetch();
        setIsComplete(true);
        
        toast({
          title: "Association des prix réussie",
          description: `${updatedCount} SKUs ont été associés avec leurs prix correspondants.`,
        });
      } else {
        toast({
          title: "Aucune mise à jour effectuée",
          description: "Aucun SKU nécessitant une mise à jour de prix n'a été trouvé.",
          variant: "default"
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
      setIsLoading(false);
    }
  };

  return {
    associatePrices,
    isLoading,
    isComplete
  };
}
