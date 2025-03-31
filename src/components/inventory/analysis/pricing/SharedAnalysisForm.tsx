
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const SharedAnalysisForm: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [lastOrderQuantity, setLastOrderQuantity] = useState<string>('');
  const [labStatus, setLabStatus] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<string>('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="lastOrderQuantity">Qté dernière commande</Label>
        <Input 
          id="lastOrderQuantity" 
          value={lastOrderQuantity}
          onChange={(e) => setLastOrderQuantity(e.target.value)}
          placeholder="Ex: 5000"
          className="bg-[#1A1A1A] border-[#272727]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastOrderDate">Date de dernière commande</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-[#1A1A1A] border-[#272727]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP', { locale: fr }) : "Sélectionner une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-[#272727]">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="labStatus">Étiquette labo</Label>
        <Input 
          id="labStatus" 
          value={labStatus}
          onChange={(e) => setLabStatus(e.target.value)}
          placeholder="Status du laboratoire"
          className="bg-[#1A1A1A] border-[#272727]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deliveryTime">Délai de livraison</Label>
        <Input 
          id="deliveryTime" 
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          placeholder="Ex: 6, 6-8 semaines"
          className="bg-[#1A1A1A] border-[#272727]"
        />
      </div>
    </div>
  );
};

export default SharedAnalysisForm;
