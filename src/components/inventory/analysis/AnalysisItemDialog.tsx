
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AnalysisItemDialogProps {
  item: any;
  onClose: () => void;
  onUpdate: (updatedItem: any) => void;
}

export const AnalysisItemDialog: React.FC<AnalysisItemDialogProps> = ({ 
  item, 
  onClose, 
  onUpdate 
}) => {
  // État local pour les modifications
  const [localItem, setLocalItem] = useState({
    ...item,
    lastOrderQuantity: item.lastOrderQuantity || '',
    lastOrderDate: item.lastOrderDate ? new Date(item.lastOrderDate) : null,
    labStatus: item.labStatus || '',
    estimatedDeliveryDate: item.estimatedDeliveryDate ? new Date(item.estimatedDeliveryDate) : null,
  });

  // Gestionnaire pour les changements de valeurs numériques
  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === '' ? '' : parseInt(value, 10);
    setLocalItem(prev => ({ ...prev, [field]: numValue }));
  };

  // Gestionnaire pour les changements de sélection
  const handleSelectChange = (field: string, value: string) => {
    setLocalItem(prev => ({ ...prev, [field]: value }));
  };

  // Gestionnaire pour les changements de date
  const handleDateChange = (field: string, date: Date | null) => {
    setLocalItem(prev => ({ ...prev, [field]: date }));
  };

  // Soumettre les modifications
  const handleSubmit = () => {
    const formattedItem = {
      ...localItem,
      lastOrderDate: localItem.lastOrderDate ? format(localItem.lastOrderDate, 'yyyy-MM-dd') : null,
      estimatedDeliveryDate: localItem.estimatedDeliveryDate ? format(localItem.estimatedDeliveryDate, 'yyyy-MM-dd') : null,
    };
    onUpdate(formattedItem);
  };

  // Détermine la couleur du badge de priorité
  const getPriorityBadgeClass = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-900/20 text-red-400 border-red-800';
      case 'medium': return 'bg-yellow-900/20 text-yellow-400 border-yellow-800';
      case 'low': return 'bg-green-900/20 text-green-400 border-green-800';
      default: return 'bg-blue-900/20 text-blue-400 border-blue-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#121212] border border-[#272727]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            {item.sku} - {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Informations de l'étape précédente */}
          <div className="space-y-4 border-r border-[#272727] pr-4">
            <h3 className="text-sm font-medium text-[#3ECF8E]">Informations produit</h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-400">Date ajoutée</div>
              <div>{item.addedDate}</div>
              
              <div className="text-gray-400">Âge</div>
              <div>{item.age} jours</div>
              
              <div className="text-gray-400">Priorité</div>
              <div>
                <Badge variant="outline" className={cn(getPriorityBadgeClass(item.priority))}>
                  {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </Badge>
              </div>
              
              <div className="text-gray-400">Stock actuel</div>
              <div>{item.current}</div>
              
              <div className="text-gray-400">Seuil</div>
              <div>{item.threshold}</div>
            </div>
            
            {item.notes && (
              <div className="mt-4">
                <div className="text-gray-400 text-sm">Note</div>
                <div className="text-sm mt-1 p-2 bg-[#1E1E1E] rounded border border-[#272727]">
                  {item.notes}
                </div>
              </div>
            )}
          </div>

          {/* Champs à remplir */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#3ECF8E]">Informations de commande</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="lastOrderQuantity">Quantité de la dernière commande</Label>
                <Input
                  id="lastOrderQuantity"
                  type="number"
                  value={localItem.lastOrderQuantity}
                  onChange={(e) => handleNumberChange('lastOrderQuantity', e.target.value)}
                  className="bg-[#1E1E1E] border-[#272727]"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="lastOrderDate">Date de la dernière commande</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="lastOrderDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#1E1E1E] border-[#272727]",
                        !localItem.lastOrderDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localItem.lastOrderDate ? (
                        format(localItem.lastOrderDate, 'PPP', { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1E1E1E] border-[#272727]">
                    <Calendar
                      mode="single"
                      selected={localItem.lastOrderDate || undefined}
                      onSelect={(date) => handleDateChange('lastOrderDate', date)}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="labStatus">Étiquette au laboratoire</Label>
                <Select 
                  value={localItem.labStatus || ""} 
                  onValueChange={(value) => handleSelectChange('labStatus', value)}
                >
                  <SelectTrigger 
                    id="labStatus" 
                    className="bg-[#1E1E1E] border-[#272727]"
                  >
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1E1E] border-[#272727]">
                    <SelectItem value="ok">OK</SelectItem>
                    <SelectItem value="toOrder">À commander</SelectItem>
                    <SelectItem value="missing">Manquante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="estimatedDeliveryDate">Date de livraison estimée</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="estimatedDeliveryDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#1E1E1E] border-[#272727]",
                        !localItem.estimatedDeliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localItem.estimatedDeliveryDate ? (
                        format(localItem.estimatedDeliveryDate, 'PPP', { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1E1E1E] border-[#272727]">
                    <Calendar
                      mode="single"
                      selected={localItem.estimatedDeliveryDate || undefined}
                      onSelect={(date) => handleDateChange('estimatedDeliveryDate', date)}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-[#272727]">
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
