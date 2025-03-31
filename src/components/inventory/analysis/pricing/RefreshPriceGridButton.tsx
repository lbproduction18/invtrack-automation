
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

interface RefreshPriceGridButtonProps {
  onRefresh?: () => Promise<void>;
}

const RefreshPriceGridButton: React.FC<RefreshPriceGridButtonProps> = ({ 
  onRefresh = async () => {} 
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast({
        title: "Données actualisées",
        description: "La grille tarifaire a été mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error refreshing price grid:', error);
      toast({
        title: "Erreur d'actualisation",
        description: "Impossible d'actualiser les données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="h-8 px-2 text-xs bg-[#161616] border-[#272727] hover:bg-[#272727]"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Actualisation...' : 'Rafraichir la grille de prix'}
    </Button>
  );
};

export default RefreshPriceGridButton;
