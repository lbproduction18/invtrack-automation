
import { useState } from 'react';

/**
 * Hook to manage the active tab in the budget simulation
 */
export function useSimulationTabs() {
  const [activeTab, setActiveTab] = useState<string>('configuration');
  
  return {
    activeTab,
    setActiveTab
  };
}
