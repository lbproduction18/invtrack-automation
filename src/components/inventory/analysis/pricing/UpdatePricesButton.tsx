
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductPrice } from '@/hooks/useProductPrices';
import { AnalysisItem } from '@/types/analysisItem';
import { cn } from '@/lib/utils';

interface UpdatePricesButtonProps {
  productPrices: ProductPrice[];
  selectedSKUs: Record<string, string[]>;
  analysisItems: AnalysisItem[];
}

const UpdatePricesButton: React.FC<UpdatePricesButtonProps> = ({
  productPrices,
  selectedSKUs,
  analysisItems
}) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get all selected SKUs as a flat array
  const allSelectedSKUs = Object.values(selectedSKUs).flat();
  
  // Count how many SKUs are selected
  const selectedSKUCount = allSelectedSKUs.length;

  const handleUpdatePrices = async () => {
    if (selectedSKUCount === 0) {
      toast({
        title: "Aucun SKU sélectionné",
        description: "Veuillez sélectionner au moins un SKU pour associer les prix.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Prix associés avec succès",
        description: `Les prix ont été mis à jour pour ${selectedSKUCount} SKU(s).`,
        variant: "default",
      });
      setIsUpdating(false);
    }, 1500);
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleUpdatePrices}
      disabled={isUpdating || selectedSKUCount === 0}
      className={cn(
        "text-xs h-9 transition-all duration-200 rounded-md",
        "hover:scale-105 focus:ring-1 focus:ring-primary/30",
        selectedSKUCount === 0 && "opacity-70"
      )}
    >
      <LinkIcon className="mr-2 h-3.5 w-3.5" />
      {isUpdating ? 'Association...' : 'Associer les prix'}
    </Button>
  );
};

export default UpdatePricesButton;
