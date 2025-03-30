
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export interface RefreshPricesButtonProps {
  onRefresh: () => void | Promise<void>; // Update type to accept both void and Promise<void>
  isLoading?: boolean;
}

const RefreshPricesButton: React.FC<RefreshPricesButtonProps> = ({ 
  onRefresh,
  isLoading = false
}) => {
  const handleRefresh = () => {
    // Handle both Promise and non-Promise returns
    const result = onRefresh();
    if (result instanceof Promise) {
      // If it returns a Promise, we let it resolve naturally
      return result;
    }
    // If not a Promise, we return a resolved Promise to satisfy the type
    return Promise.resolve();
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
