import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useResetAnalysisItems() {
  const { toast } = useToast();

  const resetAnalysisItems = useMutation({
    mutationFn: async () => {
      try {
        console.log('Resetting analysis items...');
        
        // Get all analysis items
        const { data: analysisItems, error: fetchError } = await supabase
          .from('analysis_items')
          .select('id, sku_code, sku_label');
          
        if (fetchError) {
          throw fetchError;
        }
        
        if (!analysisItems || analysisItems.length === 0) {
          console.log('No analysis items to reset');
          return;
        }
        
        // For each item, reset all price-related fields but preserve SKU data
        const updates = analysisItems.map(item => ({
          id: item.id,
          // KEEP the sku_code and sku_label values untouched
          // Only reset price and quantity fields
          price_1000: null,
          price_2000: null,
          price_3000: null,
          price_4000: null,
          price_5000: null,
          price_8000: null,
          quantity_selected: null,
        }));
        
        // Perform the update
        for (const update of updates) {
          const { error: updateError } = await supabase
            .from('analysis_items')
            .update(update)
            .eq('id', update.id);
            
          if (updateError) {
            throw updateError;
          }
        }
        
        console.log('Reset complete for all analysis items, SKU associations preserved');
        
        return { success: true };
      } catch (error) {
        console.error('Error resetting analysis items:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Réinitialisation réussie",
        description: "Les données de prix et quantités ont été réinitialisées. Les associations SKU ont été préservées.",
        variant: "default"
      });
    },
    onError: (error) => {
      console.error('Error in reset mutation:', error);
      toast({
        title: "Erreur lors de la réinitialisation",
        description: "Une erreur est survenue lors de la réinitialisation des données.",
        variant: "destructive"
      });
    }
  });

  return { resetAnalysisItems };
}
