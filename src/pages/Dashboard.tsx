
import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { StockChartSection } from '@/components/dashboard/StockChartSection';
import { StockHealthSection } from '@/components/dashboard/StockHealthSection';
import { InventoryTabs } from '@/components/dashboard/InventoryTabs';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader />
      <SummaryCards />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <StockChartSection />
        <StockHealthSection />
      </div>
      
      <InventoryTabs />
    </div>
  );
};

export default Dashboard;
