
import React from 'react';
import { SimulationMetadata } from '@/types/simulationMetadata';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pencil, Play, Trash2 } from 'lucide-react';

interface SimulationsListProps {
  simulations: SimulationMetadata[];
  onSelectSimulation: (simulation: SimulationMetadata) => void;
  onEditSimulation: (simulation: SimulationMetadata) => void;
  onDeleteSimulation?: (simulation: SimulationMetadata) => void;
}

const SimulationsList: React.FC<SimulationsListProps> = ({
  simulations,
  onSelectSimulation,
  onEditSimulation,
  onDeleteSimulation
}) => {
  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Function to get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'running':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'completed':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  // Function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'running':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

  return (
    <Card className="border border-[#272727] bg-[#161616]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Simulations</CardTitle>
      </CardHeader>
      <CardContent>
        {simulations.length === 0 ? (
          <p className="text-center py-4 text-gray-400">
            Aucune simulation trouvée.
          </p>
        ) : (
          <div className="space-y-3">
            {simulations.map((simulation) => (
              <div 
                key={simulation.id}
                className="p-3 border border-[#272727] bg-[#121212] rounded-md hover:bg-[#191919] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{simulation.simulation_name || 'Simulation sans nom'}</h3>
                    <p className="text-xs text-gray-400">
                      {formatDate(simulation.created_at)}
                    </p>
                  </div>
                  <Badge className={getStatusBadgeColor(simulation.status)}>
                    {getStatusText(simulation.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 my-2 text-xs text-gray-300">
                  <div>
                    <span className="text-gray-400">Budget: </span>
                    <span className="font-mono">{simulation.budget_max.toLocaleString()} $</span>
                  </div>
                </div>
                
                {simulation.ai_notes && (
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                    {simulation.ai_notes}
                  </p>
                )}
                
                <div className="flex justify-end space-x-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-[#272727] bg-[#161616] hover:bg-[#222] h-8"
                    onClick={() => onEditSimulation(simulation)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Modifier
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="default"
                    className="h-8"
                    onClick={() => onSelectSimulation(simulation)}
                  >
                    <Play className="h-3.5 w-3.5 mr-1" />
                    Sélectionner
                  </Button>
                  
                  {onDeleteSimulation && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="h-8"
                      onClick={() => onDeleteSimulation(simulation)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulationsList;
