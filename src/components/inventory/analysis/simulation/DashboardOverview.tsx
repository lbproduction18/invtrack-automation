
import React from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  type SimulationScenario, 
  type SimulationSession 
} from '@/hooks/useSimulationData';
import { Coins, ListChecks, Package, Percent } from 'lucide-react';

interface DashboardOverviewProps {
  scenario: SimulationScenario;
  session: SimulationSession | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  scenario,
  session
}) => {
  const budget = session?.budget || 0;
  const budgetUsage = budget > 0 ? (scenario.total_cost / budget) * 100 : 0;
  const avgCostPerSku = scenario.total_skus > 0 
    ? scenario.total_cost / scenario.total_skus 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-[#161616] border-[#272727]">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total Cost</p>
              <h3 className="text-xl font-bold mt-1">
                {new Intl.NumberFormat('fr-CA', { 
                  style: 'currency', 
                  currency: 'CAD',
                  maximumFractionDigits: 0 
                }).format(scenario.total_cost)}
              </h3>
            </div>
            <div className="p-2 bg-green-900/20 rounded-full">
              <Coins className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#161616] border-[#272727]">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Budget Usage</p>
              <h3 className="text-xl font-bold mt-1">
                {budgetUsage.toFixed(1)}%
              </h3>
            </div>
            <div className="p-2 bg-blue-900/20 rounded-full">
              <Percent className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#161616] border-[#272727]">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Total SKUs</p>
              <h3 className="text-xl font-bold mt-1">
                {scenario.total_skus}
              </h3>
            </div>
            <div className="p-2 bg-purple-900/20 rounded-full">
              <Package className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-[#161616] border-[#272727]">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400">Avg Cost per SKU</p>
              <h3 className="text-xl font-bold mt-1">
                {new Intl.NumberFormat('fr-CA', { 
                  style: 'currency', 
                  currency: 'CAD',
                  maximumFractionDigits: 0 
                }).format(avgCostPerSku)}
              </h3>
            </div>
            <div className="p-2 bg-amber-900/20 rounded-full">
              <ListChecks className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
