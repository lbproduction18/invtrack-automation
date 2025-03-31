
import React, { useState, useEffect } from 'react';
import { 
  useSimulationSessions, 
  useSimulationScenarios, 
  useSimulationResults 
} from '@/hooks/useSimulationData';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardOverview from './DashboardOverview';
import SummaryBox from './SummaryBox';
import ProductRecommendationTable from './ProductRecommendationTable';
import ScenarioSwitcher from './ScenarioSwitcher';

const SimulationDashboard: React.FC = () => {
  // Fetch simulation data
  const { data: sessions, isLoading: isLoadingSessions } = useSimulationSessions();
  
  // Get the most recent simulation session
  const latestSession = sessions?.[0] || null;
  const simulationId = latestSession?.id || null;
  
  // Fetch scenarios for the latest simulation
  const { 
    data: scenarios = [], 
    isLoading: isLoadingScenarios 
  } = useSimulationScenarios(simulationId);
  
  // Track the active scenario
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  
  // Set the first scenario as active when data loads
  useEffect(() => {
    if (scenarios.length > 0 && !activeScenarioId) {
      setActiveScenarioId(scenarios[0].id);
    }
  }, [scenarios, activeScenarioId]);
  
  // Fetch results for the active scenario
  const { 
    data: results = [], 
    isLoading: isLoadingResults 
  } = useSimulationResults(activeScenarioId);
  
  // Find the current active scenario
  const activeScenario = scenarios.find(s => s.id === activeScenarioId);
  
  // Loading state
  const isLoading = isLoadingSessions || isLoadingScenarios || isLoadingResults;
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-md" />
        <Skeleton className="h-[400px] rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!latestSession) {
    return (
      <div className="text-center p-8 bg-[#161616] border border-[#272727] rounded-md">
        <h3 className="text-lg font-medium text-gray-200 mb-2">No simulation data available</h3>
        <p className="text-gray-400">
          No AI simulation has been run yet. Configure your simulation parameters and run a simulation to see results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scenario switcher at the top */}
      <div>
        <h3 className="text-base font-medium text-gray-200 mb-3">AI-Generated Scenarios</h3>
        <ScenarioSwitcher
          scenarios={scenarios}
          activeScenarioId={activeScenarioId}
          onScenarioChange={setActiveScenarioId}
        />
      </div>
      
      {activeScenario && (
        <>
          {/* Overview cards */}
          <div>
            <h3 className="text-base font-medium text-gray-200 mb-3">
              Dashboard Overview: {activeScenario.name}
            </h3>
            <DashboardOverview
              scenario={activeScenario}
              session={latestSession}
            />
          </div>
          
          {/* AI Summary */}
          <div>
            <h3 className="text-base font-medium text-gray-200 mb-3">AI Analysis</h3>
            <SummaryBox summary={activeScenario.summary_comment} />
          </div>
          
          {/* Product recommendation table */}
          <div>
            <h3 className="text-base font-medium text-gray-200 mb-3">Recommended Products</h3>
            <ProductRecommendationTable results={results} />
          </div>
        </>
      )}
    </div>
  );
};

export default SimulationDashboard;
