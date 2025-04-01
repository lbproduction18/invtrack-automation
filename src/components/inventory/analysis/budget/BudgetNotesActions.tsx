
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BudgetNotesActionsProps {
  notes?: string | null;
  className?: string;
}

const BudgetNotesActions: React.FC<BudgetNotesActionsProps> = ({ notes, className }) => {
  if (!notes) return null;
  
  return (
    <Card className={cn("border border-[#272727] bg-[#161616]", className)}>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-2">Notes d'analyse</h3>
        <p className="text-sm text-gray-400">{notes}</p>
      </CardContent>
    </Card>
  );
};

export default BudgetNotesActions;
