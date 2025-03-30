
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalysisItems, type AnalysisItem } from '@/hooks/useAnalysisItems';
import { ProductPrice } from '@/hooks/useProductPrices';

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
        return;
      }
      
      // For each selected SKU, find the corresponding analysis item and update its prices
      const updateList: Partial<AnalysisItem>[] = [];
      
      for (const sku of allSelectedSKUs) {
        // Find the analysis item for this SKU
        const analysisItem = analysisItems.find(item => item.sku_code === sku);
        
        if (analysisItem) {
          // Extract product category from SKU for pricing lookup
          const skuParts = sku.split('-');
          const productCategory = skuParts[0];
          
          // Find the matching product price for this category
          const productPrice = productPrices.find(p => {
            const normalizedProductName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const normalizedCategory = productCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
          });
          
          if (productPrice) {
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
            console.warn(`No price information found for SKU ${sku}`);
          }
        } else {
          console.warn(`No analysis item found for SKU ${sku}`);
        }
      }
      
      // Update all the prices at once
      if (updateList.length > 0) {
        await updateSKUPrices.mutateAsync(updateList);
        setIsComplete(true);
        
        // Reset the complete state after a few seconds
        setTimeout(() => setIsComplete(false), 3000);
      } else {
        toast({
          title: "Aucune mise à jour effectuée",
          description: "Aucun SKU correspondant n'a été trouvé dans la base de données.",
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
      className={`text-xs ${className}`}
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
          <RefreshCw className="mr-2 h-3 w-3" />
          Mettre à jour les prix
        </>
      )}
    </Button>
  );
};

export default UpdatePricesButton;
