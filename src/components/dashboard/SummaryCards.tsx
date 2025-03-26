
import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  ArrowUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SummaryCards: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="card-glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">548</div>
          <p className="text-xs text-muted-foreground">
            Active products across all categories
          </p>
        </CardContent>
      </Card>
      <Card className="card-glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">23</div>
          <div className="flex items-center pt-1">
            <span className="text-success text-xs font-medium flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 14%
            </span>
            <span className="text-xs text-muted-foreground ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
      <Card className="card-glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">47</div>
          <div className="flex items-center pt-1">
            <span className="text-danger text-xs font-medium flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 32%
            </span>
            <span className="text-xs text-muted-foreground ml-2">since last week</span>
          </div>
        </CardContent>
      </Card>
      <Card className="card-glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$124,320</div>
          <div className="flex items-center pt-1">
            <span className="text-success text-xs font-medium flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 7%
            </span>
            <span className="text-xs text-muted-foreground ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
