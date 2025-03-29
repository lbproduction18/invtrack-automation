
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to handle updating quantities in Supabase
 */
export function useQuantityUpdate() {
  const { toast } = useToast();

  /**
   * Update the analysis_items table in Supabase with the quantity
   */
  const updateAnalysisItemQuantity = async (productId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('analysis_items')
        .update({ quantity_selected: quantity })
        .eq('product_id', productId);

      if (error) {
        console.error('Error updating quantity in Supabase:', error);
        toast({
          title: "Erreur de mise à jour",
          description: "La quantité n'a pas pu être sauvegardée. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Exception when updating quantity:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la quantité.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { updateAnalysisItemQuantity };
}
