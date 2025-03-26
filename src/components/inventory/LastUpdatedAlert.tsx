
import React from 'react';
import { Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLastUpdated } from '@/hooks/useLastUpdated';

export const LastUpdatedAlert: React.FC = () => {
  const { formatLastUpdated } = useLastUpdated();

  return (
    <Alert className="bg-[#121212]/60 border-[#272727] backdrop-blur-sm">
      <Clock className="h-4 w-4 text-[#3ECF8E]" />
      <AlertDescription className="text-sm text-gray-300">
        <span className="font-medium text-white">Dernière mise à jour automatique:</span> {formatLastUpdated()}
        <div className="mt-1 text-xs text-gray-400">
          Les données sont automatiquement mises à jour chaque jour à 04:00
        </div>
      </AlertDescription>
    </Alert>
  );
};
