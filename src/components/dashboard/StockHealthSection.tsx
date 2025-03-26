
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CategoryHealthProps {
  name: string;
  percentage: number;
  hasWarning?: boolean;
  warningMessage?: string;
}

const CategoryHealth: React.FC<CategoryHealthProps> = ({ 
  name, 
  percentage, 
  hasWarning = false, 
  warningMessage 
}) => {
  const getColorClass = (percent: number) => {
    if (percent < 50) return 'text-danger';
    if (percent < 75) return 'text-warning';
    return 'text-success';
  };

  const getIndicatorClass = (percent: number) => {
    if (percent < 50) return 'bg-danger';
    if (percent < 75) return 'bg-warning';
    if (percent < 90) return 'bg-info';
    return 'bg-success';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{name}</span>
          {hasWarning && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{warningMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className={`text-sm ${getColorClass(percentage)}`}>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" indicatorClassName={getIndicatorClass(percentage)} />
    </div>
  );
};

export const StockHealthSection: React.FC = () => {
  const categories = [
    { name: 'Electronics', percentage: 72, hasWarning: true, warningMessage: '12 items below threshold' },
    { name: 'Clothing', percentage: 89 },
    { name: 'Home Goods', percentage: 45, hasWarning: true, warningMessage: '23 items below threshold' },
    { name: 'Accessories', percentage: 92 },
    { name: 'Beauty', percentage: 84 }
  ];

  return (
    <Card className="card-glass md:col-span-3">
      <CardHeader>
        <CardTitle>Stock Health</CardTitle>
        <CardDescription>
          Overall inventory status by category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map(category => (
          <CategoryHealth 
            key={category.name}
            name={category.name}
            percentage={category.percentage}
            hasWarning={category.hasWarning}
            warningMessage={category.warningMessage}
          />
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          View All Categories
        </Button>
      </CardFooter>
    </Card>
  );
};
