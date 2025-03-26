
import React from 'react';
import { Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLastUpdated } from '@/hooks/useLastUpdated';

export const LastUpdatedAlert: React.FC = () => {
  const { formatLastUpdated } = useLastUpdated();

  return (
    <Alert className="bg-[#0A0A0B] border-[#1D1D20] rounded-md backdrop-blur-sm mb-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent pointer-events-none" />
      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 text-[#8B5CF6] mt-0.5" />
        <div className="flex-1">
          <AlertDescription className="text-sm text-gray-200 font-medium">
            <span className="text-white">Dernière mise à jour automatique:</span> {formatLastUpdated()}
            <div className="mt-1 text-xs text-gray-400">
              Les données sont automatiquement mises à jour chaque jour à 04:00
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
