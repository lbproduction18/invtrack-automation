
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatDate } from '@/components/dashboard/low-stock/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

// Create interfaces for our component props
interface AnalysisProduct {
  id: string;
  product_id: string;
  quantity_selected: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  productDetails: {
    id: string;
    SKU: string;
    product_name: string | null;
    current_stock: number;
    threshold: number;
    lab_status: string | null;
    estimated_delivery_date: string | null;
    last_order_date: string | null;
    last_order_quantity: number | null;
  } | null;
}

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
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];
  
  // Function to update quantity selected
  const updateQuantity = async (analysisItemId: string, quantity: QuantityOption) => {
    setIsUpdating(prev => ({ ...prev, [analysisItemId]: true }));
    
    try {
      const { error } = await supabase
        .from('analysis_items')
        .update({ quantity_selected: quantity })
        .eq('id', analysisItemId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Quantité mise à jour",
        description: "La quantité sélectionnée a été mise à jour avec succès."
      });
      
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
  
  // Function to update lab status
  const updateLabStatus = async (productId: string, labStatus: string) => {
    try {
      const { error } = await supabase
        .from('Low stock product')
        .update({ lab_status: labStatus })
        .eq('id', productId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Statut labo mis à jour",
        description: "Le statut labo a été mis à jour avec succès."
      });
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error updating lab status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut labo.",
        variant: "destructive"
      });
    }
  };
  
  // Function to update estimated delivery date
  const updateEstimatedDeliveryDate = async (productId: string, date: Date | null) => {
    try {
      const { error } = await supabase
        .from('Low stock product')
        .update({ estimated_delivery_date: date ? date.toISOString() : null })
        .eq('id', productId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Date de livraison mise à jour",
        description: "La date de livraison estimée a été mise à jour avec succès."
      });
      
      refetchAnalysis();
    } catch (error) {
      console.error('Error updating delivery date:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la date de livraison estimée.",
        variant: "destructive"
      });
    }
  };
  
  // Function to remove item from analysis
  const removeFromAnalysis = async (analysisItemId: string, productId: string) => {
    try {
      // First update the product status back to low_stock
      const { error: productError } = await supabase
        .from('Low stock product')
        .update({ status: 'low_stock' })
        .eq('id', productId);
      
      if (productError) {
        throw productError;
      }
      
      // Then delete the analysis item
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

  const labStatusOptions = [
    { value: 'pending', label: 'En attente' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' }
  ];

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
              <TableHead className="text-xs font-medium text-gray-400 text-center">Dernière commande</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Étiquette labo</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center">Date livraison est.</TableHead>
              <TableHead className="text-xs font-medium text-gray-400 text-center w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={8} className="h-16">
                    <div className="w-full h-full animate-pulse bg-[#161616]/50" />
                  </TableCell>
                </TableRow>
              ))
            ) : analysisProducts.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
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
              // Analysis products table
              analysisProducts.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#161616] border-t border-[#272727]">
                  {/* SKU / Product Name */}
                  <TableCell className="font-medium whitespace-nowrap pl-4">
                    <div className="flex flex-col">
                      <span>{item.productDetails?.SKU}</span>
                      {item.productDetails?.product_name && (
                        <span className="text-xs text-gray-400">{item.productDetails.product_name}</span>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Current Stock */}
                  <TableCell className="text-center">
                    <span className={item.productDetails?.current_stock < item.productDetails?.threshold ? "text-red-500" : ""}>
                      {item.productDetails?.current_stock}
                    </span>
                  </TableCell>
                  
                  {/* Threshold */}
                  <TableCell className="text-center text-gray-400">
                    {item.productDetails?.threshold}
                  </TableCell>
                  
                  {/* Quantity Selector */}
                  <TableCell className="text-center">
                    <Select
                      value={item.quantity_selected?.toString() || ""}
                      onValueChange={(value) => updateQuantity(item.id, parseInt(value) as QuantityOption)}
                      disabled={isUpdating[item.id]}
                    >
                      <SelectTrigger className="w-full max-w-[120px] mx-auto bg-[#121212] border-[#272727]">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
                        {quantityOptions.map(qty => (
                          <SelectItem key={qty} value={qty.toString()}>
                            {qty.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  {/* Last Order */}
                  <TableCell className="text-center text-xs">
                    {item.productDetails?.last_order_date ? (
                      <div className="flex flex-col items-center">
                        <span>{formatDate(item.productDetails.last_order_date)}</span>
                        <span className="text-gray-400">{item.productDetails.last_order_quantity} pcs</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  
                  {/* Lab Status */}
                  <TableCell className="text-center">
                    <Select
                      value={item.productDetails?.lab_status || ""}
                      onValueChange={(value) => updateLabStatus(item.productDetails?.id || "", value)}
                    >
                      <SelectTrigger className="w-full max-w-[120px] mx-auto bg-[#121212] border-[#272727]">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
                        {labStatusOptions.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  {/* Estimated Delivery Date */}
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full max-w-[120px] mx-auto bg-[#121212] border-[#272727] h-10 justify-between"
                        >
                          {item.productDetails?.estimated_delivery_date ? (
                            format(new Date(item.productDetails.estimated_delivery_date), 'P', { locale: fr })
                          ) : (
                            <span className="text-gray-500">Date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-[#161616] border-[#272727] p-0">
                        <Calendar
                          mode="single"
                          selected={item.productDetails?.estimated_delivery_date ? new Date(item.productDetails.estimated_delivery_date) : undefined}
                          onSelect={(date) => updateEstimatedDeliveryDate(item.productDetails?.id || "", date)}
                          className="bg-[#161616]"
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  
                  {/* Actions */}
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
