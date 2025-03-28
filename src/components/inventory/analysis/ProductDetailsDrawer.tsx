
import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ShoppingCart, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatDate } from "@/components/dashboard/low-stock/utils";
import { type Product } from "@/types/product";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { useToast } from "@/hooks/use-toast";

type SelectedProduct = Product & { 
  selectedQuantity?: QuantityOption;
  labStatus?: string | null;
  weeks_delivery?: string | null; // Ajouté le champ weeks_delivery ici
};

interface ProductDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: SelectedProduct | null;
  selectedProductIndex: number | null;
  productsCount: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onQuantityChange: (productId: string, quantity: QuantityOption) => void;
  onUpdateProduct: (productId: string, updates: Partial<Product> | { weeks_delivery?: string }) => void;
  getTotalPrice: (product: SelectedProduct) => number;
  onCreateOrder: () => void;
}

const ProductDetailsDrawer: React.FC<ProductDetailsDrawerProps> = ({
  isOpen,
  onOpenChange,
  selectedProduct,
  selectedProductIndex,
  productsCount,
  onNavigate,
  onQuantityChange,
  onUpdateProduct,
  getTotalPrice,
  onCreateOrder
}) => {
  const { toast } = useToast();
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];

  if (!selectedProduct) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-[#141414] border-l border-[#272727]">
        <SheetHeader className="border-b border-[#272727] pb-4 mb-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-left">{selectedProduct.SKU}</SheetTitle>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onNavigate('prev')}
                disabled={selectedProductIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onNavigate('next')}
                disabled={selectedProductIndex === productsCount - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SheetDescription>
            {selectedProduct.product_name || "Produit sans nom"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* Stock Information */}
          <div>
            <h3 className="text-sm font-medium mb-2">Informations de Stock</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-400">Stock Actuel:</div>
              <div className={selectedProduct.current_stock < selectedProduct.threshold ? "text-red-500" : ""}>
                {selectedProduct.current_stock}
              </div>
              <div className="text-gray-400">Seuil:</div>
              <div>{selectedProduct.threshold}</div>
              <div className="text-gray-400">Priorité:</div>
              <div>{selectedProduct.priority_badge}</div>
              <div className="text-gray-400">Date d'ajout:</div>
              <div>{formatDate(selectedProduct.created_at)}</div>
            </div>
          </div>
          
          {/* Last Order */}
          <div>
            <h3 className="text-sm font-medium mb-2">Dernière Commande</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-400">Date:</div>
              <div>{selectedProduct.last_order_date ? formatDate(selectedProduct.last_order_date) : "-"}</div>
              <div className="text-gray-400">Quantité:</div>
              <div>{selectedProduct.last_order_quantity || "-"}</div>
            </div>
          </div>
          
          {/* Order Configuration */}
          <div>
            <h3 className="text-sm font-medium mb-2">Configuration de la Commande</h3>
            
            <div className="bg-[#1A1A1A] p-3 rounded-md mb-3">
              <div className="text-sm mb-2">Quantité à commander:</div>
              <Select
                value={selectedProduct.selectedQuantity?.toString() || undefined}
                onValueChange={(value) => {
                  if (value) {
                    const qty = parseInt(value) as QuantityOption;
                    onQuantityChange(selectedProduct.id, qty);
                  }
                }}
              >
                <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                  <SelectValue placeholder="Choisir une quantité" />
                </SelectTrigger>
                <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
                  {quantityOptions.map(qty => (
                    <SelectItem key={qty} value={qty.toString()}>
                      {qty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedProduct.selectedQuantity && (
                <div className="mt-2 text-right">
                  <div className="text-xs text-gray-400">Prix total:</div>
                  <div className="font-medium">{getTotalPrice(selectedProduct).toLocaleString()} $</div>
                  <div className="text-xs text-gray-400">
                    {(getTotalPrice(selectedProduct) / selectedProduct.selectedQuantity * 1000).toFixed(2)} $ / 1000
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Étiquette au laboratoire</p>
                <Select
                  value={selectedProduct.lab_status || undefined}
                  onValueChange={(value) => {
                    onUpdateProduct(selectedProduct.id, { lab_status: value });
                  }}
                >
                  <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
                    <SelectItem value="OK">OK</SelectItem>
                    <SelectItem value="À commander">À commander</SelectItem>
                    <SelectItem value="Manquante">Manquante</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Date de livraison estimée</p>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 bg-[#121212] border border-[#272727] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedProduct.estimated_delivery_date || ""}
                    onChange={(e) => {
                      onUpdateProduct(selectedProduct.id, { 
                        estimated_delivery_date: e.target.value || null 
                      });
                    }}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Délai de livraison (semaines)</p>
                <Input
                  type="text" // Changé de "number" à "text"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#272727] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedProduct.weeks_delivery || ""}
                  placeholder="Ex: 6, 6-8, ~6..."
                  onChange={(e) => {
                    onUpdateProduct(selectedProduct.id, { 
                      weeks_delivery: e.target.value 
                    });
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Product Notes */}
          {selectedProduct.note && (
            <div>
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <div className="bg-[#1A1A1A] p-3 rounded-md text-sm">
                {selectedProduct.note}
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter className="flex mt-6 border-t border-[#272727] pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Fermer
            </Button>
          </SheetClose>
          <Button className="flex-1" onClick={onCreateOrder}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Commander
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDetailsDrawer;
