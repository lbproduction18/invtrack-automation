
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshPriceGridButtonProps {
  className?: string;
}

const RefreshPriceGridButton: React.FC<RefreshPriceGridButtonProps> = ({ className }) => {
  // This button is a placeholder for now - no functionality required
  const handleRefresh = () => {
    console.log('Refresh price grid button clicked');
    // Future functionality will be added here
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleRefresh}
      className={`text-xs h-8 border-[#272727] bg-[#161616] hover:bg-[#222] ${className}`}
    >
      <RefreshCw className="mr-2 h-3 w-3" />
      Rafraîchir la grille de prix
    </Button>
  );
};

export default RefreshPriceGridButton;
