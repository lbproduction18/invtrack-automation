
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type AnalysisItem } from '@/types/analysisItem';

export function usePriceAssociation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ 
      analysisItems, 
      products 
    }: { 
      analysisItems: AnalysisItem[], 
      products: Array<any> 
    }) => {
      console.log('Starting price association...');
      
      if (!analysisItems || analysisItems.length === 0 || !products || products.length === 0) {
        throw new Error('Missing required data for price association');
      }
      
      // For tracking which items were updated
      const updatedItems: string[] = [];
      const skippedItems: string[] = [];
      
      // Build update operations
      const updates = analysisItems
        .filter(item => item.sku_code)
        .map(item => {
          // Find the corresponding product
          const matchingProduct = products.find(p => p.id === item.product_id);
          
          if (!matchingProduct) {
            console.log(`No matching product found for analysis item ${item.id} with product_id ${item.product_id}`);
            skippedItems.push(item.sku_code || item.id);
            return null;
          }
          
          // Check if prices exist in the product
          if (matchingProduct.price_1000 !== undefined || 
              matchingProduct.price_2000 !== undefined || 
              matchingProduct.price_3000 !== undefined || 
              matchingProduct.price_4000 !== undefined || 
              matchingProduct.price_5000 !== undefined) {
            
            updatedItems.push(item.sku_code || item.id);
            
            return {
              id: item.id,
              price_1000: matchingProduct.price_1000,
              price_2000: matchingProduct.price_2000,
              price_3000: matchingProduct.price_3000,
              price_4000: matchingProduct.price_4000,
              price_5000: matchingProduct.price_5000,
              // Only include price_8000 if it exists on the product
              ...(matchingProduct.price_8000 !== undefined ? { price_8000: matchingProduct.price_8000 } : {})
            };
          } else {
            console.log(`No pricing information found for product ${matchingProduct.product_name} (${matchingProduct.id})`);
            skippedItems.push(item.sku_code || item.id);
            return null;
          }
        })
        .filter(update => update !== null);
      
      console.log(`Generated ${updates.length} price updates`);
      
      if (updates.length === 0) {
        return { updatedItems: [], skippedItems };
      }
      
      // Execute updates in batches
      const batchSize = 50; // Adjust based on Supabase limits
      let successCount = 0;
      
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        
        for (const update of batch) {
          if (!update) continue;
          
          const { error } = await supabase
            .from('analysis_items')
            .update({
              price_1000: update.price_1000,
              price_2000: update.price_2000,
              price_3000: update.price_3000,
              price_4000: update.price_4000,
              price_5000: update.price_5000,
              // Only include price_8000 if it exists in the update
              ...(update.price_8000 !== undefined ? { price_8000: update.price_8000 } : {})
            })
            .eq('id', update.id);
          
          if (error) {
            console.error(`Error updating prices for item ${update.id}:`, error);
            // Continue with other updates even if one fails
          } else {
            successCount++;
          }
        }
      }
      
      console.log(`Successfully updated ${successCount} items out of ${updates.length} attempts`);
      return { 
        updatedItems, 
        skippedItems,
        successCount 
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
      
      const { updatedItems, skippedItems, successCount } = result;
      
      if (updatedItems.length > 0) {
        toast({
          title: "Prix associés avec succès",
          description: `${successCount} SKU(s) ont été mis à jour avec les prix correspondants.`,
        });
        setIsComplete(true);
        // Reset complete state after 3 seconds
        setTimeout(() => setIsComplete(false), 3000);
      } else {
        toast({
          title: "Aucun prix associé",
          description: "Aucun SKU n'a pu être mis à jour avec les prix correspondants.",
          variant: "default"
        });
      }
      
      if (skippedItems.length > 0) {
        console.log('Skipped items:', skippedItems);
      }
    },
    onError: (error) => {
      console.error('Error associating prices:', error);
      
      toast({
        title: "Erreur lors de l'association des prix",
        description: "Une erreur s'est produite lors de l'association des prix aux SKUs. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  // The actual function that will be called from the component
  const associatePrices = async () => {
    try {
      setIsLoading(true);
      
      // Fetch the necessary data
      const { data: analysisItems, error: analysisError } = await supabase
        .from('analysis_items')
        .select('*');
        
      if (analysisError) throw analysisError;
      
      // Fix: Use the correct table name "Low stock product" instead of "products"
      const { data: products, error: productsError } = await supabase
        .from('Low stock product')
        .select('*');
        
      if (productsError) throw productsError;
      
      // Call the mutation with the fetched data
      await mutation.mutateAsync({ 
        analysisItems: analysisItems as AnalysisItem[], 
        products 
      });
      
    } catch (error) {
      console.error('Error in associatePrices function:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'association des prix.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    associatePrices,
    isLoading,
    isComplete,
    isPriceAssociationLoading: mutation.isPending,
    isPriceAssociationComplete: isComplete
  };
}
