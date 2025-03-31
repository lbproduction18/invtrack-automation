
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for handling notifications related to price operations
 */
export function useNotifications() {
  const { toast } = useToast();

  /**
   * Show a notification when a product is removed
   */
  const notifyProductRemoved = (sku: string) => {
    toast({
      title: "Produit supprimé",
      description: `${sku} a été retiré de la simulation.`,
      variant: "default"
    });
  };

  /**
   * Show a notification when a quantity is updated
   */
  const notifyQuantityUpdated = (sku: string, quantity: string) => {
    toast({
      title: "Quantité mise à jour",
      description: `${sku}: ${quantity} unités`,
      variant: "default"
    });
  };

  /**
   * Show a notification when a note is viewed
   */
  const notifyNoteViewed = (sku: string) => {
    toast({
      title: "Note importante",
      description: `Attention requise pour ${sku}`,
      variant: "destructive"
    });
  };

  return {
    notifyProductRemoved,
    notifyQuantityUpdated,
    notifyNoteViewed
  };
}
