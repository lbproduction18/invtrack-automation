
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export interface RefreshPricesButtonProps {
  onRefresh: () => Promise<void>;
  isLoading?: boolean; // Make isLoading optional to fix the build error
}

const RefreshPricesButton: React.FC<RefreshPricesButtonProps> = ({ 
  onRefresh,
  isLoading = false // Default to false if not provided
}) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onRefresh}
      disabled={isLoading}
      className="border-[#272727] bg-[#161616] hover:bg-[#222] flex items-center"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Actualisation...' : 'Actualiser les prix'}
    </Button>
  );
};

export default RefreshPricesButton;
