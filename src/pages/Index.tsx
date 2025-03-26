
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground">
            Main page of the application
          </p>
        </div>
      </div>

      <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Application Content</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 items-center justify-center text-center py-10">
            <h2 className="text-2xl font-semibold">Simplified Application</h2>
            <p className="text-muted-foreground max-w-md">
              All other pages have been removed. This is now the main page of the application.
            </p>
            <Button className="mt-4">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
