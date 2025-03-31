
import React, { useState, useEffect } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Eye, Info, Calendar as CalendarIcon, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';
import { useNotifications } from '../pricing/hooks/useNotifications';
import { useEditableFields } from './hooks/useEditableFields';

interface AnalysisProductRowProps {
  item: AnalysisProduct;
  handleRowClick: (product: AnalysisProduct) => void;
  toggleNoteExpansion: (e: React.MouseEvent, productId: string) => void;
  refetchAnalysis: () => void;
}

const AnalysisProductRow: React.FC<AnalysisProductRowProps> = ({
  item,
  handleRowClick,
  toggleNoteExpansion,
  refetchAnalysis
}) => {
  const { toast } = useToast();
  const { notifyProductRemoved } = useNotifications();
  const { updateAnalysisItem } = useAnalysisItems();
  
  const { 
    editableValues, 
    isUpdating, 
    saveSuccess, 
    handleInputChange,
    updateLastOrderInfo,
    updateLastOrderDate,
    updateLabStatusText,
    updateWeeksDelivery
  } = useEditableFields(item, refetchAnalysis);

  // Handle the "Enter" key for form inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, saveFunction: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunction();
    }
  };

  const removeFromAnalysis = async () => {
    try {
      const { error: productError } = await supabase
        .from('Low stock product')
        .update({ status: 'low_stock' })
        .eq('id', item.product_id);
      
      if (productError) {
        throw productError;
      }
      
      const { error } = await supabase
        .from('analysis_items')
        .delete()
        .eq('id', item.id);
      
      if (error) {
        throw error;
      }
      
      notifyProductRemoved(item.sku_code || "");
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error removing item from analysis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit de l'analyse.",
        variant: "destructive"
      });
    }
  };

  return (
    <TableRow 
      className="hover:bg-[#161616] border-t border-[#272727] cursor-pointer"
      onClick={() => handleRowClick(item)}
    >
      <TableCell className="font-medium whitespace-nowrap pl-4">
        <div className="flex flex-col">
          <span>{item.sku_code}</span>
          {item.sku_label && (
            <span className="text-xs text-gray-400">{item.sku_label}</span>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-center">
        <span className={(item.stock !== null && item.threshold !== null && item.stock < item.threshold) ? "text-red-500" : ""}>
          {item.stock !== null ? item.stock : '-'}
        </span>
      </TableCell>
      
      <TableCell className="text-center text-gray-400">
        {item.threshold !== null ? item.threshold : '-'}
      </TableCell>

      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        {item.note ? (
          <div className="flex justify-center">
            <button 
              onClick={(e) => toggleNoteExpansion(e, item.id)}
              className="inline-flex items-center justify-center rounded-full p-1 transition-colors bg-sky-500/10 hover:bg-sky-500/20 text-sky-500"
              aria-label="Voir la note"
            >
              <Info className="h-4 w-4 text-sky-500" />
            </button>
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center space-x-2">
          <Input
            className="w-32 bg-[#121212] border-[#272727] text-center"
            value={editableValues[`last_order_${item.id}`] || ''}
            onChange={(e) => handleInputChange(`last_order_${item.id}`, e.target.value)}
            onBlur={() => updateLastOrderInfo(item.id)}
            onKeyDown={(e) => handleKeyDown(e, () => updateLastOrderInfo(item.id))}
            placeholder="Qt dernière commande"
            disabled={isUpdating[`last_order_${item.id}`]}
          />
          {isUpdating[`last_order_${item.id}`] && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          {saveSuccess[`last_order_${item.id}`] && <Check className="w-4 h-4 text-green-500" />}
        </div>
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center justify-center space-y-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full max-w-[120px] mx-auto bg-[#121212] border-[#272727] h-10 justify-between"
                disabled={isUpdating[`last_order_date_${item.id}`]}
              >
                {editableValues[`last_order_date_${item.id}`] ? (
                  format(new Date(editableValues[`last_order_date_${item.id}`]), 'P', { locale: fr })
                ) : (
                  <span className="text-gray-500">Date</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-[#161616] border-[#272727] p-0">
              <Calendar
                mode="single"
                selected={editableValues[`last_order_date_${item.id}`] ? new Date(editableValues[`last_order_date_${item.id}`]) : undefined}
                onSelect={(date) => updateLastOrderDate(item.id, date)}
                className="bg-[#161616] pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {isUpdating[`last_order_date_${item.id}`] && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          {saveSuccess[`last_order_date_${item.id}`] && <Check className="w-4 h-4 text-green-500" />}
        </div>
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center space-x-2">
          <Input
            className="w-32 bg-[#121212] border-[#272727] text-center"
            value={editableValues[`lab_status_${item.id}`] || ''}
            onChange={(e) => handleInputChange(`lab_status_${item.id}`, e.target.value)}
            onBlur={() => updateLabStatusText(item.id)}
            onKeyDown={(e) => handleKeyDown(e, () => updateLabStatusText(item.id))}
            placeholder="Étiquette labo"
            disabled={isUpdating[`lab_status_${item.id}`]}
          />
          {isUpdating[`lab_status_${item.id}`] && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          {saveSuccess[`lab_status_${item.id}`] && <Check className="w-4 h-4 text-green-500" />}
        </div>
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center space-x-2">
          <Input
            className="w-32 bg-[#121212] border-[#272727] text-center"
            value={editableValues[`weeks_delivery_${item.id}`] || ''}
            onChange={(e) => handleInputChange(`weeks_delivery_${item.id}`, e.target.value)}
            onBlur={() => updateWeeksDelivery(item.id)}
            onKeyDown={(e) => handleKeyDown(e, () => updateWeeksDelivery(item.id))}
            placeholder="Ex: 6, 6-8 semaines"
            disabled={isUpdating[`weeks_delivery_${item.id}`]}
          />
          {isUpdating[`weeks_delivery_${item.id}`] && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          {saveSuccess[`weeks_delivery_${item.id}`] && <Check className="w-4 h-4 text-green-500" />}
        </div>
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-500/10 hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(item);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-500/10 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              removeFromAnalysis();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AnalysisProductRow;
