
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';
import { useNotifications } from '../pricing/hooks/useNotifications';
import { useEditableFields } from './hooks/useEditableFields';

// Import our new sub-components
import SKUCell from './row/SKUCell';
import StockCell from './row/StockCell';
import NoteCell from './row/NoteCell';
import EditableField from './row/EditableField';
import DateField from './row/DateField';
import RowActions from './row/RowActions';

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
      <SKUCell skuCode={item.sku_code} skuLabel={item.sku_label} />
      
      <StockCell stock={item.stock} threshold={item.threshold} />
      
      <TableCell className="text-center text-gray-400">
        {item.threshold !== null ? item.threshold : '-'}
      </TableCell>

      <NoteCell 
        note={item.note} 
        toggleNoteExpansion={(e) => toggleNoteExpansion(e, item.id)} 
      />
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <EditableField
          value={editableValues[`last_order_${item.id}`] || ''}
          onChange={(value) => handleInputChange(`last_order_${item.id}`, value)}
          onBlur={() => updateLastOrderInfo(item.id)}
          onKeyDown={(e) => handleKeyDown(e, () => updateLastOrderInfo(item.id))}
          placeholder="Qt dernière commande"
          isUpdating={isUpdating[`last_order_${item.id}`]}
          saveSuccess={saveSuccess[`last_order_${item.id}`]}
        />
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <DateField
          value={editableValues[`last_order_date_${item.id}`] ? new Date(editableValues[`last_order_date_${item.id}`]) : null}
          onSelect={(date) => updateLastOrderDate(item.id, date)}
          isUpdating={isUpdating[`last_order_date_${item.id}`]}
          saveSuccess={saveSuccess[`last_order_date_${item.id}`]}
        />
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <EditableField
          value={editableValues[`lab_status_${item.id}`] || ''}
          onChange={(value) => handleInputChange(`lab_status_${item.id}`, value)}
          onBlur={() => updateLabStatusText(item.id)}
          onKeyDown={(e) => handleKeyDown(e, () => updateLabStatusText(item.id))}
          placeholder="Étiquette labo"
          isUpdating={isUpdating[`lab_status_${item.id}`]}
          saveSuccess={saveSuccess[`lab_status_${item.id}`]}
        />
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <EditableField
          value={editableValues[`weeks_delivery_${item.id}`] || ''}
          onChange={(value) => handleInputChange(`weeks_delivery_${item.id}`, value)}
          onBlur={() => updateWeeksDelivery(item.id)}
          onKeyDown={(e) => handleKeyDown(e, () => updateWeeksDelivery(item.id))}
          placeholder="Ex: 6, 6-8 semaines"
          isUpdating={isUpdating[`weeks_delivery_${item.id}`]}
          saveSuccess={saveSuccess[`weeks_delivery_${item.id}`]}
        />
      </TableCell>
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <RowActions
          onView={() => handleRowClick(item)}
          onRemove={removeFromAnalysis}
        />
      </TableCell>
    </TableRow>
  );
};

export default AnalysisProductRow;
