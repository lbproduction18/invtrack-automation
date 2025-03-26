
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
      <Card className="border border-[#272727] bg-[#121212]/60 backdrop-blur-sm shadow-md rounded-lg overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-[#272727] bg-gradient-to-r from-[#1a1a1a] to-[#121212]">
          <CardTitle className="text-base font-medium text-white flex items-center">
            <span className="h-5 w-1 bg-[#3ECF8E] rounded-full mr-3"></span>
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-gray-400 ml-4">
            {description}
          </CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};
