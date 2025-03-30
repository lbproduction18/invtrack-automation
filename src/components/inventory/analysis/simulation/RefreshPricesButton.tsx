
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export interface RefreshPricesButtonProps {
  onRefresh: () => void | Promise<void>; // Accept both void and Promise<void>
  isLoading?: boolean;
}

const RefreshPricesButton: React.FC<RefreshPricesButtonProps> = ({ 
  onRefresh,
  isLoading = false
}) => {
  const handleRefresh = async () => {
    try {
      // Handle both void and Promise<void> returns
      const result = onRefresh();
      
      // If it's a Promise, await it to properly handle any errors
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error("Error refreshing prices:", error);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh}
      disabled={isLoading}
      className="border-[#272727] bg-[#161616] hover:bg-[#222] flex items-center"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Actualisation...' : 'Actualiser les prix'}
    </Button>
  );
};

export default RefreshPricesButton;
