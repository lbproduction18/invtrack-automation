
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshPricesButtonProps {
  onRefresh: () => Promise<void>;
  className?: string;
}

const RefreshPricesButton: React.FC<RefreshPricesButtonProps> = ({ 
  onRefresh,
  className = ""
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className={`flex justify-end mb-4 ${className}`}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Actualisation...' : 'Actualiser les prix'}
      </Button>
    </div>
  );
};

export default RefreshPricesButton;
