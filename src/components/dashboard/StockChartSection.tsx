
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StockChart } from '@/components/dashboard/StockChart';

export const StockChartSection: React.FC = () => {
  return (
    <Card className="card-glass md:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Stock Levels</span>
          <div className="flex items-center gap-1">
            <Badge variant="secondary">30 Days</Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Inventory level trends across product categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StockChart />
      </CardContent>
    </Card>
  );
};
