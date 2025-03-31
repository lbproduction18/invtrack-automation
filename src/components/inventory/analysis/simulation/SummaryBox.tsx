
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCog } from 'lucide-react';

interface SummaryBoxProps {
  summary: string;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ summary }) => {
  return (
    <Card className="bg-[#161616] border-[#272727]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 bg-indigo-900/20 rounded-full">
            <BrainCog className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-base font-medium mb-2">AI Summary</h3>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {summary || "No summary available for this scenario."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryBox;
