
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to reset price and quantity data in analysis items
 */
export function useResetAnalysisItems() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const resetAnalysisItems = useMutation({
    mutationFn: async () => {
      console.log('Resetting all price and quantity data in analysis_items table...');
      
      const { data, error } = await supabase
        .from('analysis_items')
        .update({
          price_1000: null,
          price_2000: null,
          price_3000: null,
          price_4000: null,
          price_5000: null,
          price_8000: null,
          quantity_selected: null,
          sku_code: null,
          sku_label: null
        })
        .is('status', 'analysis');
      
      if (error) {
        console.error('Error resetting analysis items:', error);
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate the relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['analysisItems'] });
      
      toast({
        title: "Données réinitialisées",
        description: "Toutes les données de prix et quantités ont été effacées de la base de données."
      });
    },
    onError: (error) => {
      console.error('Error occurred during reset:', error);
      toast({
        title: "Erreur lors de la réinitialisation",
        description: "Une erreur est survenue lors de la réinitialisation des données.",
        variant: "destructive"
      });
    }
  });

  return { resetAnalysisItems };
}
