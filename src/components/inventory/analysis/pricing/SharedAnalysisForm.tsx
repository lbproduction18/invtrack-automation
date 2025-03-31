
import React from 'react';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface SharedAnalysisFormProps {
  onSubmit?: (data: SharedAnalysisFormData) => void;
}

export interface SharedAnalysisFormData {
  lastOrderQuantity: string;
  lastOrderDate: Date | undefined;
  labLabel: string;
  deliveryDelay: string;
}

const SharedAnalysisForm: React.FC<SharedAnalysisFormProps> = ({ onSubmit }) => {
  const form = useForm<SharedAnalysisFormData>({
    defaultValues: {
      lastOrderQuantity: '',
      lastOrderDate: undefined,
      labLabel: '',
      deliveryDelay: ''
    }
  });

  const handleSubmit = (data: SharedAnalysisFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    console.log('Form data submitted:', data);
  };

  return (
    <div className="mt-4 bg-[#1E1E1E] rounded-md p-6">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Last Order Quantity */}
          <div className="space-y-2">
            <Label htmlFor="lastOrderQuantity" className="text-sm text-gray-300">
              Qté dernière commande
            </Label>
            <Input
              id="lastOrderQuantity"
              type="text"
              className="bg-[#161616] border-[#272727]"
              {...form.register('lastOrderQuantity')}
            />
          </div>

          {/* Last Order Date */}
          <div className="space-y-2">
            <Label htmlFor="lastOrderDate" className="text-sm text-gray-300">
              Date de dernière commande
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal bg-[#161616] border-[#272727] ${
                    !form.watch('lastOrderDate') ? 'text-gray-500' : 'text-white'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('lastOrderDate') ? (
                    format(form.watch('lastOrderDate')!, 'PPP', { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1E1E1E] border-[#272727]">
                <Calendar
                  mode="single"
                  selected={form.watch('lastOrderDate')}
                  onSelect={(date) => form.setValue('lastOrderDate', date)}
                  initialFocus
                  className="bg-[#1E1E1E]"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Lab Label */}
          <div className="space-y-2">
            <Label htmlFor="labLabel" className="text-sm text-gray-300">
              Étiquette labo
            </Label>
            <Input
              id="labLabel"
              type="text"
              className="bg-[#161616] border-[#272727]"
              {...form.register('labLabel')}
            />
          </div>

          {/* Delivery Delay */}
          <div className="space-y-2">
            <Label htmlFor="deliveryDelay" className="text-sm text-gray-300">
              Délai de livraison
            </Label>
            <Input
              id="deliveryDelay"
              type="text"
              placeholder="ex: 6, 6-8 semaines"
              className="bg-[#161616] border-[#272727]"
              {...form.register('deliveryDelay')}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SharedAnalysisForm;
