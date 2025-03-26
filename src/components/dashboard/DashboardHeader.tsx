
import React from 'react';
import { ShoppingCart, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your inventory status and recent activity
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <ArrowDown className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>
    </div>
  );
};
