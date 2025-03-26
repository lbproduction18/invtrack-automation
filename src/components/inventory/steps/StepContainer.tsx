
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface StepContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="space-y-4 p-4">
      <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="px-4 py-3 border-b border-[#272727]">
          <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
          <CardDescription className="text-xs text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};
