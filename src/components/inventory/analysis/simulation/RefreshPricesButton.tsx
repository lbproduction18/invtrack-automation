
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshPricesButtonProps {
  onRefresh: () => Promise<void>;
}

const RefreshPricesButton: React.FC<RefreshPricesButtonProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-end mb-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRefresh}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Actualiser les prix
      </Button>
    </div>
  );
};

export default RefreshPricesButton;
