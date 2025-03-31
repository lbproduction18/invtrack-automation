
import React from 'react';
import BudgetNotesActions from '../budget/BudgetNotesActions';

interface BudgetSimulationLayoutProps {
  children?: React.ReactNode;
  tabsContent: React.ReactNode;
  sidePanel: React.ReactNode;
  notes?: string | null;
}

const BudgetSimulationLayout: React.FC<BudgetSimulationLayoutProps> = ({
  tabsContent,
  sidePanel,
  notes
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {tabsContent}
          <BudgetNotesActions notes={notes} className="mt-4" />
        </div>
        <div className="space-y-4">
          {sidePanel}
        </div>
      </div>
    </div>
  );
};

export default BudgetSimulationLayout;
