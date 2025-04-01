
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from 'lucide-react';
import { useAISimulationMetadata } from '@/hooks/useAISimulationMetadata';
import { formatTotalPrice } from '../PriceFormatter';
import { Loader2 } from 'lucide-react';

const AINoteDisplay = () => {
  const { metadata, isLoading } = useAISimulationMetadata();

  if (isLoading) {
    return (
      <Card className="border-[#272727] bg-[#161616] mt-4">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-gray-400">Chargement des données AI...</span>
        </CardContent>
      </Card>
    );
  }

  if (!metadata || (!metadata.ai_note && !metadata.simulation_label)) {
    return null;
  }

  return (
    <Card className="border-[#272727] bg-[#161616] mt-4">
      <CardContent className="p-4 space-y-3">
        {metadata.simulation_label && (
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-primary">
              {metadata.simulation_label}
            </h4>
            {metadata.budget_max && (
              <span className="text-sm font-medium">
                Budget: {formatTotalPrice(metadata.budget_max)}
              </span>
            )}
          </div>
        )}
        
        {metadata.ai_note && (
          <div className="flex gap-2 text-sm text-gray-300">
            <Brain className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
            <p className="italic">{metadata.ai_note}</p>
          </div>
        )}
        
        {metadata.status && metadata.status !== 'pending' && (
          <div className="text-xs text-gray-400">
            Statut: {metadata.status === 'completed' ? 'Terminé' : metadata.status}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AINoteDisplay;
