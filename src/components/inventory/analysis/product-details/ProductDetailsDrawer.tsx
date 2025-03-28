
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
import { X, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { type Product } from "@/types/product";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

import StockInformation from './StockInformation';
import LastOrderInfo from './LastOrderInfo';
import QuantitySelection from './QuantitySelection';
import ProductConfiguration from './ProductConfiguration';
import ProductNotes from './ProductNotes';

type SelectedProduct = Product & { 
  selectedQuantity?: QuantityOption;
  labStatus?: string | null;
  weeks_delivery?: string | null;
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
          <StockInformation product={selectedProduct} />
          
          {/* Last Order */}
          <LastOrderInfo 
            lastOrderDate={selectedProduct.last_order_date}
            lastOrderQuantity={selectedProduct.last_order_quantity}
          />
          
          {/* Order Configuration */}
          <div>
            <h3 className="text-sm font-medium mb-2">Configuration de la Commande</h3>
            
            <QuantitySelection
              product={selectedProduct}
              onQuantityChange={onQuantityChange}
              quantityOptions={quantityOptions}
              getTotalPrice={getTotalPrice}
            />
            
            <ProductConfiguration
              labStatus={selectedProduct.lab_status}
              estimatedDeliveryDate={selectedProduct.estimated_delivery_date}
              weeksDelivery={selectedProduct.weeks_delivery}
              onUpdateProduct={onUpdateProduct}
              productId={selectedProduct.id}
            />
          </div>
          
          {/* Product Notes */}
          <ProductNotes note={selectedProduct.note} />
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
