
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { type PriorityLevel } from '@/types/product';

interface PriorityDialogProps {
  children: React.ReactNode;
  productId: string;
  currentPriority: PriorityLevel;
  onPriorityChange: (priority: PriorityLevel) => void;
}

export const PriorityDialog: React.FC<PriorityDialogProps> = ({
  children,
  productId,
  currentPriority,
  onPriorityChange
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedPriority, setSelectedPriority] = React.useState<PriorityLevel>(currentPriority);

  const handleSave = () => {
    onPriorityChange(selectedPriority);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Changer la priorité</DialogTitle>
          <DialogDescription>
            Définir le niveau de priorité pour ce produit.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            defaultValue={currentPriority}
            value={selectedPriority}
            onValueChange={(value) => setSelectedPriority(value as PriorityLevel)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moyen" id="moyen" />
              <Label htmlFor="moyen">Moyen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="important" id="important" />
              <Label htmlFor="important">Important</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prioritaire" id="prioritaire" />
              <Label htmlFor="prioritaire">Prioritaire</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button type="submit" onClick={handleSave}>Sauvegarder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
