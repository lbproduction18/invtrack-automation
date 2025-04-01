
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalysisItems, type AnalysisItem } from '@/hooks/useAnalysisItems';
import { ProductPrice } from '@/hooks/useProductPrices';
import { supabase } from '@/integrations/supabase/client';

interface UpdatePricesButtonProps {
  productPrices: ProductPrice[];
  selectedSKUs: Record<string, string[]>;
  analysisItems: AnalysisItem[];
  className?: string;
}

const UpdatePricesButton: React.FC<UpdatePricesButtonProps> = ({
  productPrices,
  selectedSKUs,
  analysisItems,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { updateSKUPrices } = useAnalysisItems();

  // Function to trigger webhook with SKU and price data
  const triggerWebhook = async (associatedSkus: Array<{ sku: string, prices: Record<string, number> }>) => {
    const webhookUrl = 'https://hook.us2.make.com/kzlm2ott3k34x2hn9mrmt9jngmuk9a5f';
    
    try {
      // Format the payload based on how many SKUs we have
      const payload = associatedSkus.length === 1 ? associatedSkus[0] : associatedSkus;
      
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
          description: `Données envoyées pour ${associatedSkus.length} SKU(s).`,
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

  const handleUpdatePrices = async () => {
    setIsLoading(true);
    
    try {
      // Get a flat list of all selected SKUs
      const allSelectedSKUs = Object.values(selectedSKUs).flat();
      
      if (allSelectedSKUs.length === 0) {
        toast({
          title: "Aucun SKU sélectionné",
          description: "Veuillez sélectionner au moins un SKU avant de mettre à jour les prix.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Selected SKUs for price update:', allSelectedSKUs);
      
      // For each selected SKU, find the corresponding analysis item and update its prices
      const updateList: Partial<AnalysisItem>[] = [];
      const webhookData: Array<{ sku: string, prices: Record<string, number> }> = [];
      
      // Loop through each product ID in the selectedSKUs record
      for (const productId of Object.keys(selectedSKUs)) {
        // Find the product price data for this specific row
        const productPrice = productPrices.find(p => p.id === productId);
        
        if (!productPrice) {
          console.warn(`No price information found for product ID ${productId}`);
          continue;
        }
        
        // Get the SKUs selected in this row
        const skusForThisProduct = selectedSKUs[productId];
        
        // For each selected SKU in this row
        for (const sku of skusForThisProduct) {
          // Find the analysis item for this SKU
          const analysisItem = analysisItems.find(item => item.sku_code === sku);
          
          if (analysisItem) {
            console.log(`Updating SKU ${sku} with prices from product ${productPrice.product_name}:`, {
              price_1000: productPrice.price_1000,
              price_2000: productPrice.price_2000,
              price_3000: productPrice.price_3000,
              price_4000: productPrice.price_4000,
              price_5000: productPrice.price_5000,
              price_8000: productPrice.price_8000
            });
            
            // Add to update list with prices from this specific row
            updateList.push({
              id: analysisItem.id,
              price_1000: productPrice.price_1000,
              price_2000: productPrice.price_2000,
              price_3000: productPrice.price_3000,
              price_4000: productPrice.price_4000,
              price_5000: productPrice.price_5000,
              price_8000: productPrice.price_8000
            });
            
            // Prepare webhook data for this SKU
            const prices: Record<string, number> = {};
            if (productPrice.price_1000) prices['1000'] = productPrice.price_1000;
            if (productPrice.price_2000) prices['2000'] = productPrice.price_2000;
            if (productPrice.price_3000) prices['3000'] = productPrice.price_3000;
            if (productPrice.price_4000) prices['4000'] = productPrice.price_4000;
            if (productPrice.price_5000) prices['5000'] = productPrice.price_5000;
            if (productPrice.price_8000) prices['8000'] = productPrice.price_8000;
            
            webhookData.push({
              sku: sku,
              prices: prices
            });
          } else {
            console.warn(`No analysis item found for SKU ${sku}`);
          }
        }
      }
      
      console.log('Price updates to be applied:', updateList);
      
      // Update all the prices at once
      if (updateList.length > 0) {
        // Use the Supabase client directly to update the records
        for (const item of updateList) {
          const priceData = {
            price_1000: item.price_1000,
            price_2000: item.price_2000,
            price_3000: item.price_3000,
            price_4000: item.price_4000,
            price_5000: item.price_5000,
            price_8000: item.price_8000
          };
          
          const { error } = await supabase
            .from('analysis_items')
            .update(priceData)
            .eq('id', item.id);
            
          if (error) {
            console.error(`Error updating prices for item ${item.id}:`, error);
            throw error;
          }
        }
        
        // After successful DB update, trigger the webhook
        if (webhookData.length > 0) {
          triggerWebhook(webhookData);
        }
        
        setIsComplete(true);
        
        toast({
          title: "Prix mis à jour",
          description: `Les prix de ${updateList.length} SKU(s) ont été mis à jour avec succès.`,
        });
        
        // Reset the complete state after a few seconds
        setTimeout(() => setIsComplete(false), 3000);
      } else {
        toast({
          title: "Aucune mise à jour effectuée",
          description: "Aucune correspondance trouvée entre les SKUs sélectionnés et les prix disponibles.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: "Une erreur s'est produite lors de la mise à jour des prix.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      disabled={isLoading}
      onClick={handleUpdatePrices}
      className={`text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222] ${className}`}
    >
      {isLoading ? (
        <>
          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
          Mise à jour en cours...
        </>
      ) : isComplete ? (
        <>
          <Check className="mr-2 h-3 w-3 text-green-500" />
          Prix mis à jour
        </>
      ) : (
        <>
          <Tag className="mr-2 h-3 w-3" />
          Associer les prix
        </>
      )}
    </Button>
  );
};

export default UpdatePricesButton;
