
import React from 'react';
import { Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLastUpdated } from '@/hooks/useLastUpdated';

export const LastUpdatedAlert: React.FC = () => {
  const { formatLastUpdated } = useLastUpdated();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className="bg-[#3D1F0D] rounded-md overflow-hidden">
        <Alert className="border-none bg-transparent backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[#F97316] mt-0.5" />
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
      </div>
    </div>
  );
};
