import React from 'react';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LowStockTable } from '@/components/dashboard/low-stock/LowStockTable';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';

export const InventoryTabs: React.FC = () => {
  return (
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
  );
};
