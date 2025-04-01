
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
  const triggerWebhook = (sku: string, priceData: Record<string, number | null>) => {
    // Format price data for webhook
    const prices: Record<string, number> = {};
    
    // Only include non-null price values in the payload
    if (priceData.price_1000 !== null) prices['1000'] = priceData.price_1000 as number;
    if (priceData.price_2000 !== null) prices['2000'] = priceData.price_2000 as number;
    if (priceData.price_3000 !== null) prices['3000'] = priceData.price_3000 as number;
    if (priceData.price_4000 !== null) prices['4000'] = priceData.price_4000 as number;
    if (priceData.price_5000 !== null) prices['5000'] = priceData.price_5000 as number;
    if (priceData.price_8000 !== null) prices['8000'] = priceData.price_8000 as number;
    
    // Create payload
    const payload = {
      sku,
      prices
    };
    
    console.log(`Sending webhook for SKU ${sku}:`, payload);
    
    // Asynchronously call the webhook
    fetch('https://hook.us2.make.com/kzlm2ott3k34x2hn9mrmt9jngmuk9a5f', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(error => {
      // Log error but don't interrupt the flow
      console.error(`Error calling webhook for SKU ${sku}:`, error);
    });
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
          
          // After successful database update, trigger the webhook
          // Find the corresponding SKU for this item
          const analysisItem = analysisItems.find(ai => ai.id === item.id);
          if (analysisItem && analysisItem.sku_code) {
            // Trigger webhook asynchronously for each updated SKU
            triggerWebhook(analysisItem.sku_code, priceData);
          }
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
