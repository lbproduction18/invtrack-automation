
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, AlertCircle, RefreshCw, Trash2, Check, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';

interface AnalysisProductsGridProps {
  analysisProducts: AnalysisProduct[];
  isLoading: boolean;
  refetchAnalysis: () => void;
}

const AnalysisProductsGrid: React.FC<AnalysisProductsGridProps> = ({ 
  analysisProducts, 
  isLoading,
  refetchAnalysis
}) => {
  const { toast } = useToast();
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
    const initialValues: Record<string, any> = {};
    analysisProducts.forEach(item => {
      initialValues[`quantity_${item.id}`] = item.quantity_selected || '';
      initialValues[`last_order_${item.id}`] = item.last_order_info || '';
      initialValues[`lab_status_${item.id}`] = item.lab_status_text || '';
      initialValues[`last_order_date_${item.id}`] = item.last_order_date || null;
      initialValues[`weeks_delivery_${item.id}`] = item.weeks_delivery || '';
    });
    setEditableValues(initialValues);
  }, [analysisProducts]);
  
  const handleInputChange = (key: string, value: any) => {
    setEditableValues(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const updateQuantity = async (analysisItemId: string) => {
    const quantityKey = `quantity_${analysisItemId}`;
    const quantityValue = editableValues[quantityKey];
    
    if (quantityValue === '') return;
    
    setIsUpdating(prev => ({ ...prev, [analysisItemId]: true }));
    setSaveSuccess(prev => ({ ...prev, [analysisItemId]: false }));
    
    try {
      const { error } = await supabase
        .from('analysis_items')
        .update({ quantity_selected: parseInt(quantityValue) })
        .eq('id', analysisItemId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Quantité mise à jour",
        description: "La quantité sélectionnée a été mise à jour avec succès."
      });
      
      setSaveSuccess(prev => ({ ...prev, [analysisItemId]: true }));
      
      setTimeout(() => {
        setSaveSuccess(prev => ({ ...prev, [analysisItemId]: false }));
      }, 3000);
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité sélectionnée.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [analysisItemId]: false }));
    }
  };
  
  const updateLastOrderInfo = async (analysisItemId: string) => {
    const infoKey = `last_order_${analysisItemId}`;
    const infoValue = editableValues[infoKey];
    
    setIsUpdating(prev => ({ ...prev, [infoKey]: true }));
    setSaveSuccess(prev => ({ ...prev, [infoKey]: false }));
    
    try {
      const { error } = await supabase
        .from('analysis_items')
        .update({ last_order_info: infoValue })
        .eq('id', analysisItemId);
      
      if (error) {
        throw error;
      }
      
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
      const { error } = await supabase
        .from('analysis_items')
        .update({ last_order_date: date ? date.toISOString() : null })
        .eq('id', analysisItemId);
      
      if (error) {
        throw error;
      }
      
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
      const { error } = await supabase
        .from('analysis_items')
        .update({ lab_status_text: statusValue })
        .eq('id', analysisItemId);
      
      if (error) {
        throw error;
      }
      
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
      const { error } = await supabase
        .from('analysis_items')
        .update({ weeks_delivery: weeksValue })
        .eq('id', analysisItemId);
      
      if (error) {
        throw error;
      }
      
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
  
  const removeFromAnalysis = async (analysisItemId: string, productId: string) => {
    try {
      const { error: productError } = await supabase
        .from('Low stock product')
        .update({ status: 'low_stock' })
        .eq('id', productId);
      
      if (productError) {
        throw productError;
      }
      
      const { error } = await supabase
        .from('analysis_items')
        .delete()
        .eq('id', analysisItemId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de l'analyse et remis en stock faible."
      });
      
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

  // Handle the "Enter" key for form inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, saveFunction: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunction();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Produits en analyse ({analysisProducts.length})</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchAnalysis()} 
          disabled={isLoading}
          className="border-[#272727] bg-[#161616] hover:bg-[#222]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
      
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#161616]">
            <TableRow className="hover:bg-transparent border-b border-[#272727]">
              <TableHead className="text-xs font-medium text-gray-400 w-[20%] text-left pl-4">SKU / Produit</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Stock</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Seuil</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Quantité sélectionnée</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Qt dernière commande</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Date de dernière commande</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Étiquette labo</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Délai de livraison</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={9} className="h-16">
                    <div className="w-full h-full animate-pulse bg-[#161616]/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : analysisProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-400">Aucun produit en analyse</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Ajoutez des produits à l'analyse depuis la section "Observation"
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              analysisProducts.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#161616] border-t border-[#272727]">
                  <TableCell className="font-medium whitespace-nowrap pl-4">
                    <div className="flex flex-col">
                      <span>{item.productDetails?.SKU}</span>
                      {item.productDetails?.product_name && (
                        <span className="text-xs text-gray-400">{item.productDetails.product_name}</span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <span className={item.productDetails?.current_stock < item.productDetails?.threshold ? "text-red-500" : ""}>
                      {item.productDetails?.current_stock}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center text-gray-400">
                    {item.productDetails?.threshold}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Input
                        type="number"
                        className="w-32 bg-[#121212] border-[#272727] text-center"
                        value={editableValues[`quantity_${item.id}`] || ''}
                        onChange={(e) => handleInputChange(`quantity_${item.id}`, e.target.value)}
                        onBlur={() => updateQuantity(item.id)}
                        onKeyDown={(e) => handleKeyDown(e, () => updateQuantity(item.id))}
                        step="1000"
                        min="0"
                        disabled={isUpdating[item.id]}
                      />
                      {isUpdating[item.id] && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                      {saveSuccess[item.id] && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
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
                  
                  <TableCell className="text-center">
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
                      
                      {/* Display weeks since last order date */}
                      {item.last_order_date && (
                        <span className="text-xs text-gray-400">
                          {getWeeksSince(item.last_order_date)}
                        </span>
                      )}
                      
                      {isUpdating[`last_order_date_${item.id}`] && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                      {saveSuccess[`last_order_date_${item.id}`] && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
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
                  
                  <TableCell className="text-center">
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
                  
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => removeFromAnalysis(item.id, item.product_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AnalysisProductsGrid;
