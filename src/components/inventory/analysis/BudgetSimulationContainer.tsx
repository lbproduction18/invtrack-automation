
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SimulationMetadataForm from './SimulationMetadataForm';
import SimulationsList from './SimulationsList';
import { useSimulationMetadata } from '@/hooks/useSimulationMetadata';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import BudgetSimulation from './BudgetSimulation';
import { SimulationMetadata } from '@/types/simulationMetadata';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BudgetSimulationContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('new');
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationMetadata | null>(null);
  const [showSimulation, setShowSimulation] = useState<boolean>(false);
  
  const {
    simulations,
    isLoadingSimulations,
    createSimulation,
    updateSimulation,
    connectAnalysisItemsToSimulation
  } = useSimulationMetadata();
  
  const { analysisItems } = useAnalysisItems();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedSimulation(null);
    setShowSimulation(false);
  };
  
  const handleCreateSimulation = async (data: { 
    budget_max: number;
    ai_notes: string | null;
    simulation_name: string | null;
  }) => {
    try {
      const result = await createSimulation.mutateAsync(data);
      
      if (result) {
        // Connect all analysis items to this simulation
        const analysisItemIds = analysisItems.map(item => item.id);
        if (analysisItemIds.length > 0) {
          await connectAnalysisItemsToSimulation.mutateAsync({
            simulationId: result.id,
            analysisItemIds
          });
        }
        
        setSelectedSimulation(result);
        setShowSimulation(true);
      }
    } catch (error) {
      console.error('Error creating simulation:', error);
    }
  };
  
  const handleUpdateSimulation = async (id: string, data: { 
    budget_max: number;
    ai_notes: string | null;
    simulation_name: string | null;
  }) => {
    try {
      const result = await updateSimulation.mutateAsync({
        id,
        ...data
      });
      
      if (result) {
        setSelectedSimulation(result);
        setShowSimulation(true);
      }
    } catch (error) {
      console.error('Error updating simulation:', error);
    }
  };
  
  const handleSelectSimulation = (simulation: SimulationMetadata) => {
    setSelectedSimulation(simulation);
    setShowSimulation(true);
  };
  
  const handleEditSimulation = (simulation: SimulationMetadata) => {
    setSelectedSimulation(simulation);
    setActiveTab('edit');
    setShowSimulation(false);
  };
  
  // Render loading state
  if (isLoadingSimulations) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  // If we're showing a simulation, render the budget simulation component
  if (showSimulation && selectedSimulation) {
    return (
      <BudgetSimulation 
        simulation={selectedSimulation}
        onBack={() => setShowSimulation(false)}
      />
    );
  }
  
  return (
    <div className="space-y-4 p-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="new">Nouvelle simulation</TabsTrigger>
          <TabsTrigger value="list">Simulations existantes</TabsTrigger>
          {selectedSimulation && activeTab === 'edit' && (
            <TabsTrigger value="edit">Modifier</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="new" className="space-y-4">
          {analysisItems.length === 0 ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Vous devez d'abord ajouter des produits à l'analyse avant de créer une simulation.
              </AlertDescription>
            </Alert>
          ) : (
            <SimulationMetadataForm 
              onCreateSimulation={handleCreateSimulation}
              isCreating={createSimulation.isPending}
            />
          )}
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <SimulationsList 
            simulations={simulations}
            onSelectSimulation={handleSelectSimulation}
            onEditSimulation={handleEditSimulation}
          />
        </TabsContent>
        
        <TabsContent value="edit" className="space-y-4">
          {selectedSimulation && (
            <SimulationMetadataForm 
              simulation={selectedSimulation}
              onCreateSimulation={handleCreateSimulation}
              onUpdateSimulation={handleUpdateSimulation}
              isUpdating={updateSimulation.isPending}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetSimulationContainer;
