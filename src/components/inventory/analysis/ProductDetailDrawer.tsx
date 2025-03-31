
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Flag,
  Tag,
  X,
  AlertTriangle
} from "lucide-react";
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type AnalysisProduct } from '../AnalysisContent';
import { Badge } from "@/components/ui/badge";
import { formatNoteText } from '@/components/product/utils/noteUtils';

interface ProductDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: AnalysisProduct | null;
}

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  isOpen,
  onOpenChange,
  product
}) => {
  if (!product) return null;

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    try {
      return format(parseISO(dateString), 'PPP', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate age for display
  const getProductAge = (dateString: string | null) => {
    if (!dateString) return "Non spécifié";
    try {
      return formatDistanceToNow(parseISO(dateString), { locale: fr, addSuffix: true });
    } catch (error) {
      return "Date inconnue";
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string | null) => {
    if (!priority) return "bg-gray-200 text-gray-800";
    
    switch(priority) {
      case 'standard':
        return "bg-gray-200 text-gray-800";
      case 'moyen':
        return "bg-yellow-200 text-yellow-800";
      case 'prioritaire':
      case 'important':
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Format the note HTML
  const formattedNoteHtml = product.note ? formatNoteText(product.note) : null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto bg-[#141414] border-l border-[#272727]">
        <SheetHeader className="border-b border-[#272727] pb-4 mb-6">
          <SheetTitle className="text-xl flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            {product.sku_code || "SKU inconnu"}
          </SheetTitle>
          <SheetDescription>
            {product.sku_label || "Produit sans nom"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Product Notes - Prominently displayed at the top with urgent styling */}
          {product.note && (
            <div className="mb-8 animate-pulse-once">
              <div className="p-4 bg-amber-950/20 border-l-4 border-amber-500 rounded-md">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-500 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="text-base font-bold uppercase tracking-wider text-amber-500">
                      Attention Requise
                    </h3>
                    <div className="text-base font-medium whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedNoteHtml || '' }} />
                    <div className="text-xs text-gray-400 pt-2 border-t border-amber-800/30">
                      Note ajoutée le {formatDate(product.date_added)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Origin Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold border-b border-[#272727] pb-1">
              Informations d'origine
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="w-4 h-4 mt-0.5 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Date d'ajout</p>
                  <p className="text-sm">{formatDate(product.date_added)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-4 h-4 mt-0.5 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Âge</p>
                  <p className="text-sm">{getProductAge(product.date_added)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Flag className="w-4 h-4 mt-0.5 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Priorité</p>
                  <div className="mt-1">
                    {product.priority_badge ? (
                      <Badge className={`text-xs ${getPriorityColor(product.priority_badge)}`}>
                        {product.priority_badge}
                      </Badge>
                    ) : (
                      <span className="text-sm">Standard</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold border-b border-[#272727] pb-1">
              Information de stock
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Stock initial</p>
                <p className="text-lg font-semibold">{product.stock !== null ? product.stock : '-'}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Seuil</p>
                <p className="text-lg font-semibold">{product.threshold !== null ? product.threshold : '-'}</p>
              </div>
            </div>
          </div>

          {/* Current Analysis Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold border-b border-[#272727] pb-1">
              Informations d'analyse
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Étiquette labo</p>
                <p className="text-sm">{product.lab_status_text || '-'}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Délai de livraison</p>
                <p className="text-sm">{product.weeks_delivery || '-'}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Dernière commande</p>
                <p className="text-sm">{product.last_order_info || '-'}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400">Date de dernière commande</p>
                <p className="text-sm">{product.last_order_date ? formatDate(product.last_order_date) : '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 border-t border-[#272727] pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" />
              Fermer
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDetailDrawer;
