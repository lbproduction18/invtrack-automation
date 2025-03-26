
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const BudgetLoadingState: React.FC = () => {
  return (
    <Card className="border border-[#272727] bg-[#161616] shadow-md">
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#272727] rounded w-1/2"></div>
          <div className="h-10 bg-[#272727] rounded"></div>
          <div className="h-10 bg-[#272727] rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[#272727] rounded w-full"></div>
            <div className="h-4 bg-[#272727] rounded w-3/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetLoadingState;
