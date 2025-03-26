
import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLastUpdated } from '@/hooks/useLastUpdated';
import { useAlertColorPreference } from '@/hooks/useAlertColorPreference';
import { AlertColorSelector } from './AlertColorSelector';

export const LastUpdatedAlert: React.FC = () => {
  const { formatLastUpdated } = useLastUpdated();
  const { currentScheme } = useAlertColorPreference();

  // Force re-render when color changes
  useEffect(() => {
    console.log("Color scheme changed:", currentScheme);
  }, [currentScheme]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className={`${currentScheme.background} rounded-md overflow-hidden`}>
        <Alert className="border-none bg-transparent backdrop-blur-sm">
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
    </div>
  );
};
