
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { differenceInWeeks } from 'date-fns';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';

export const useEditableFields = (item: AnalysisProduct, refetchAnalysis: () => void) => {
  const { toast } = useToast();
  const { updateAnalysisItem } = useAnalysisItems();
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({});
  const [editableValues, setEditableValues] = useState<Record<string, any>>({});
  
  // Calculate weeks since a date
  const getWeeksSince = (dateString: string | null): string => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    const now = new Date();
    const weeks = differenceInWeeks(now, date);
    
    return `${weeks} semaine${weeks !== 1 ? 's' : ''}`;
  };
  
  // Initialize editable values from the analysis products
  useEffect(() => {
    setEditableValues({
      [`last_order_${item.id}`]: item.last_order_info || '',
      [`lab_status_${item.id}`]: item.lab_status_text || '',
      [`last_order_date_${item.id}`]: item.last_order_date || null,
      [`weeks_delivery_${item.id}`]: item.weeks_delivery || ''
    });
  }, [item]);
  
  const handleInputChange = (key: string, value: any) => {
    setEditableValues(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const updateLastOrderInfo = async (analysisItemId: string) => {
    const infoKey = `last_order_${analysisItemId}`;
    const infoValue = editableValues[infoKey];
    
    setIsUpdating(prev => ({ ...prev, [infoKey]: true }));
    setSaveSuccess(prev => ({ ...prev, [infoKey]: false }));
    
    try {
      await updateAnalysisItem.mutateAsync({
        id: analysisItemId,
        data: { last_order_info: infoValue }
      });
      
      toast({
        title: "Dernière commande mise à jour",
        description: "Les informations de dernière commande ont été mises à jour avec succès."
      });
      
      setSaveSuccess(prev => ({ ...prev, [infoKey]: true }));
      
      setTimeout(() => {
        setSaveSuccess(prev => ({ ...prev, [infoKey]: false }));
      }, 3000);
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error updating last order info:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de dernière commande.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [infoKey]: false }));
    }
  };
  
  const updateLastOrderDate = async (analysisItemId: string, date: Date | null) => {
    const dateKey = `last_order_date_${analysisItemId}`;
    
    setIsUpdating(prev => ({ ...prev, [dateKey]: true }));
    setSaveSuccess(prev => ({ ...prev, [dateKey]: false }));
    
    try {
      await updateAnalysisItem.mutateAsync({
        id: analysisItemId,
        data: { last_order_date: date ? date.toISOString() : null }
      });
      
      handleInputChange(dateKey, date);
      
      toast({
        title: "Date de dernière commande mise à jour",
        description: "La date de dernière commande a été mise à jour avec succès."
      });
      
      setSaveSuccess(prev => ({ ...prev, [dateKey]: true }));
      
      setTimeout(() => {
        setSaveSuccess(prev => ({ ...prev, [dateKey]: false }));
      }, 3000);
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error updating last order date:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la date de dernière commande.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [dateKey]: false }));
    }
  };
  
  const updateLabStatusText = async (analysisItemId: string) => {
    const statusKey = `lab_status_${analysisItemId}`;
    const statusValue = editableValues[statusKey];
    
    setIsUpdating(prev => ({ ...prev, [statusKey]: true }));
    setSaveSuccess(prev => ({ ...prev, [statusKey]: false }));
    
    try {
      await updateAnalysisItem.mutateAsync({
        id: analysisItemId,
        data: { lab_status_text: statusValue }
      });
      
      toast({
        title: "Étiquette labo mise à jour",
        description: "L'étiquette labo a été mise à jour avec succès."
      });
      
      setSaveSuccess(prev => ({ ...prev, [statusKey]: true }));
      
      setTimeout(() => {
        setSaveSuccess(prev => ({ ...prev, [statusKey]: false }));
      }, 3000);
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error updating lab status text:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'étiquette labo.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [statusKey]: false }));
    }
  };
  
  const updateWeeksDelivery = async (analysisItemId: string) => {
    const weeksKey = `weeks_delivery_${analysisItemId}`;
    const weeksValue = editableValues[weeksKey];
    
    setIsUpdating(prev => ({ ...prev, [weeksKey]: true }));
    setSaveSuccess(prev => ({ ...prev, [weeksKey]: false }));
    
    try {
      await updateAnalysisItem.mutateAsync({
        id: analysisItemId,
        data: { weeks_delivery: weeksValue }
      });
      
      toast({
        title: "Délai de livraison mis à jour",
        description: "Le délai de livraison a été mis à jour avec succès."
      });
      
      setSaveSuccess(prev => ({ ...prev, [weeksKey]: true }));
      
      setTimeout(() => {
        setSaveSuccess(prev => ({ ...prev, [weeksKey]: false }));
      }, 3000);
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error updating weeks delivery:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le délai de livraison.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [weeksKey]: false }));
    }
  };

  return {
    editableValues,
    isUpdating,
    saveSuccess,
    handleInputChange,
    updateLastOrderInfo,
    updateLastOrderDate,
    updateLabStatusText,
    updateWeeksDelivery,
    getWeeksSince
  };
};
