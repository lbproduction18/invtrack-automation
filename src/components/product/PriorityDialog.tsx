
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PriorityBadge } from './PriorityBadge';

interface PriorityDialogProps {
  productId: string;
  currentPriority: 'standard' | 'moyen' | 'prioritaire';
  onPriorityChange: (newPriority: 'standard' | 'moyen' | 'prioritaire') => void;
  children: React.ReactNode;
}

export const PriorityDialog: React.FC<PriorityDialogProps> = ({
  productId,
  currentPriority,
  onPriorityChange,
  children
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePriorityChange = async (priority: 'standard' | 'moyen' | 'prioritaire') => {
    try {
      const { error } = await supabase
        .from('Low stock product')
        .update({ priority_badge: priority })
        .eq('id', productId);

      if (error) {
        throw error;
      }

      onPriorityChange(priority);
      toast({
        title: "Priorité mise à jour",
        description: `La priorité est maintenant: ${priority}`,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur de mise à jour de la priorité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la priorité",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#161616] border-[#272727]">
        <DialogHeader>
          <DialogTitle className="text-white">Changer la priorité</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div 
              className="flex items-center p-3 rounded-md cursor-pointer hover:bg-[#272727]"
              onClick={() => handlePriorityChange('standard')}
            >
              <PriorityBadge priority="standard" />
              <span className="ml-3 text-gray-300">Standard</span>
              {currentPriority === 'standard' && <span className="ml-auto text-xs text-gray-400">Actuel</span>}
            </div>
            <div 
              className="flex items-center p-3 rounded-md cursor-pointer hover:bg-[#272727]"
              onClick={() => handlePriorityChange('moyen')}
            >
              <PriorityBadge priority="moyen" />
              <span className="ml-3 text-gray-300">Moyenne</span>
              {currentPriority === 'moyen' && <span className="ml-auto text-xs text-gray-400">Actuel</span>}
            </div>
            <div 
              className="flex items-center p-3 rounded-md cursor-pointer hover:bg-[#272727]"
              onClick={() => handlePriorityChange('prioritaire')}
            >
              <PriorityBadge priority="prioritaire" />
              <span className="ml-3 text-gray-300">Prioritaire</span>
              {currentPriority === 'prioritaire' && <span className="ml-auto text-xs text-gray-400">Actuel</span>}
            </div>
          </div>
        </div>
        <DialogClose asChild>
          <Button 
            variant="outline" 
            className="w-full bg-[#121212] border-[#272727] text-gray-300 hover:bg-[#1a1a1a]"
          >
            Annuler
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
