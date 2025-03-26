
import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { LowStockTable } from '@/components/dashboard/LowStockTable';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { StockChart } from '@/components/dashboard/StockChart';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
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

        <Card className="card-glass md:col-span-3">
          <CardHeader>
            <CardTitle>Stock Health</CardTitle>
            <CardDescription>
              Overall inventory status by category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Electronics</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">12 items below threshold</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm text-warning">72%</span>
              </div>
              <Progress value={72} className="h-2" indicatorClassName="bg-warning" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Clothing</span>
                </div>
                <span className="text-sm text-success">89%</span>
              </div>
              <Progress value={89} className="h-2" indicatorClassName="bg-success" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Home Goods</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">23 items below threshold</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm text-danger">45%</span>
              </div>
              <Progress value={45} className="h-2" indicatorClassName="bg-danger" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Accessories</span>
                </div>
                <span className="text-sm text-success">92%</span>
              </div>
              <Progress value={92} className="h-2" indicatorClassName="bg-success" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Beauty</span>
                </div>
                <span className="text-sm text-info">84%</span>
              </div>
              <Progress value={84} className="h-2" indicatorClassName="bg-info" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" size="sm">
              View All Categories
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="low-stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="low-stock">Low Stock Items</TabsTrigger>
          <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="low-stock" className="space-y-4">
          <Card className="card-glass">
            <CardHeader className="px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Low Stock Items</CardTitle>
                  <CardDescription>
                    Products that need to be reordered soon
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Create Order
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <LowStockTable />
            </CardContent>
            <CardFooter className="px-6 border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 10 of 47 items
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="recent-orders" className="space-y-4">
          <Card className="card-glass">
            <CardHeader className="px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Your most recent purchase orders
                  </CardDescription>
                </div>
                <Button size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <RecentOrdersTable />
            </CardContent>
            <CardFooter className="px-6 border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 10 of 23 orders
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All Orders
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
