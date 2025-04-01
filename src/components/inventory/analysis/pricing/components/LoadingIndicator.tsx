
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  loading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading }) => {
  if (!loading) return null;
  
  return <Loader2 className="h-4 w-4 animate-spin ml-2" />;
};

export default LoadingIndicator;
