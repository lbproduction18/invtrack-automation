
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type AnalysisItem } from '@/types/analysisItem';

export function useUpdateSKUPrices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSKUPrices = useMutation({
    mutationFn: async (analysisItemsWithPrices: Partial<AnalysisItem>[]) => {
      console.log('Updating prices for analysis items:', analysisItemsWithPrices);
      
      // Use Promise.all to update all items in parallel
      const updates = analysisItemsWithPrices.map(async (item) => {
        if (!item.id) return null;
        
        const { data, error } = await supabase
          .from('analysis_items')
          .update({
            price_1000: item.price_1000,
            price_2000: item.price_2000,
            price_3000: item.price_3000,
            price_4000: item.price_4000,
            price_5000: item.price_5000,
            price_8000: item.price_8000
          })
          .eq('id', item.id)
          .select();
          
        if (error) {
          console.error(`Error updating prices for item ${item.id}:`, error);
          throw error;
        }
        
        return data;
      });
      
      const results = await Promise.all(updates);
      return results.filter(Boolean);
    },
    onSuccess: () => {
      // Invalidate the queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
      
      // Show success toast
      toast({
        title: "Prix mis à jour",
        description: "Les prix des SKUs sélectionnés ont été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error updating prices:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les prix. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });

  return { updateSKUPrices };
}
