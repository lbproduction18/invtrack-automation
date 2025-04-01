
import { useToast } from '@/hooks/use-toast';

export function useWebhookTrigger() {
  const { toast } = useToast();
  const webhookUrl = 'https://hook.us2.make.com/kzlm2ott3k34x2hn9mrmt9jngmuk9a5f';

  /**
   * Triggers a webhook with the selected SKUs
   * @param selectedSKUs Array of selected SKU codes
   */
  const triggerWebhook = async (selectedSKUs: string[]) => {
    try {
      // Format the payload based on how many SKUs we have
      const payload = selectedSKUs.length === 1 
        ? { sku: selectedSKUs[0] } 
        : { skus: selectedSKUs };
      
      console.log('Sending webhook payload:', payload);
      
      // Make the webhook call asynchronously
      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Use no-cors mode to avoid CORS issues
      })
      .then(() => {
        console.log('Webhook triggered successfully');
        toast({
          title: "Webhook déclenché",
          description: `Données envoyées pour ${selectedSKUs.length} SKU(s).`,
          variant: "default"
        });
      })
      .catch(error => {
        console.error('Error triggering webhook:', error);
        // Just log the error, don't interrupt flow
      });
    } catch (error) {
      console.error('Error preparing webhook payload:', error);
    }
  };

  return { triggerWebhook };
}
