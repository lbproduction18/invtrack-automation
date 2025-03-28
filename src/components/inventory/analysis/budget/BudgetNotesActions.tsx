
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface BudgetNotesActionsProps {
  notes?: string | null;
  className?: string;
}

const BudgetNotesActions: React.FC<BudgetNotesActionsProps> = ({ 
  notes,
  className 
}) => {
  return (
    <Card className={cn("border border-[#272727] bg-[#161616]", className)}>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Notes internes</h3>
          <Textarea 
            placeholder="Ajouter des notes concernant cette commande..." 
            className="min-h-24 bg-[#121212] border-[#272727]"
            value={notes || ''}
            readOnly
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" className="border-[#272727] bg-[#161616] hover:bg-[#222]">
            Imprimer
          </Button>
          <Button variant="outline" size="sm" className="border-[#272727] bg-[#161616] hover:bg-[#222]">
            Exporter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetNotesActions;
