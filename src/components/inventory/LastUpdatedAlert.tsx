
import React from 'react';
import { Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLastUpdated } from '@/hooks/useLastUpdated';
import { useAlertColorPreference } from '@/hooks/useAlertColorPreference';
import { AlertColorSelector } from './AlertColorSelector';

export const LastUpdatedAlert: React.FC = () => {
  const { formatLastUpdated } = useLastUpdated();
  const { currentScheme } = useAlertColorPreference();

  return (
    <div className={`${currentScheme.background} rounded-md mb-4 overflow-hidden relative`}>
      <Alert className="border-[#1D1D20] backdrop-blur-sm bg-transparent">
        <div className="flex items-start gap-3">
          <Clock className={`h-5 w-5 ${currentScheme.iconColor} mt-0.5`} />
          <div className="flex-1">
            <AlertDescription className="text-sm text-gray-200 font-medium">
              <span className="text-white">Dernière mise à jour automatique:</span> {formatLastUpdated()}
              <div className="mt-1 text-xs text-gray-400">
                Les données sont automatiquement mises à jour chaque jour à 04:00
              </div>
            </AlertDescription>
          </div>
          <AlertColorSelector />
        </div>
      </Alert>
    </div>
  );
};
