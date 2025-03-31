
import React from 'react';
import { AnalysisItem } from '@/types/analysisItem';
import { Product } from '@/types/product';
import { useAnalysisItems } from './hooks/useAnalysisItems';
import LoadingIndicator from './components/LoadingIndicator';
import SimulationTable from './components/SimulationTable';
import SimulationTotal from './components/SimulationTotal';

interface SimulationSummaryProps {
  analysisItems: AnalysisItem[];
  products: Product[];
  simulationTotal: number;
}

const SimulationSummary: React.FC<SimulationSummaryProps> = ({
  analysisItems,
  products,
  simulationTotal
}) => {
  const { loading, refreshedAnalysisItems } = useAnalysisItems(analysisItems);

  return (
    <div className="mt-4 rounded-md border border-[#272727] overflow-hidden">
      <div className="p-4 bg-[#161616] flex justify-between items-center">
        <h3 className="text-lg font-medium">Résumé de la simulation</h3>
        <LoadingIndicator loading={loading} />
      </div>
      
      <SimulationTable 
        refreshedAnalysisItems={refreshedAnalysisItems}
        products={products}
      />
      
      <SimulationTotal simulationTotal={simulationTotal} />
    </div>
  );
};

export default SimulationSummary;
