
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Product } from "@/types/product";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

type SelectedProduct = Product & { 
  selectedQuantity?: QuantityOption;
};

interface ProductSummaryProps {
  products: SelectedProduct[];
  isLoading: boolean;
  onShowDetails: (index: number) => void;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({
  products,
  isLoading,
  onShowDetails
}) => {
  return (
    <div className="bg-[#161616] rounded-md p-4 border border-[#272727]">
      <h3 className="text-sm font-medium mb-2">Liste des Produits</h3>
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="flex justify-between items-center text-sm p-2 hover:bg-[#272727]/30 rounded-sm cursor-pointer"
            onClick={() => onShowDetails(index)}
          >
            <div className="flex items-center space-x-2">
              {product.selectedQuantity ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4 text-amber-500" />
              )}
              <span>{product.SKU}</span>
            </div>
            <Badge 
              variant={product.selectedQuantity ? "outline" : "secondary"}
              className={cn(
                "text-xs",
                product.selectedQuantity ? "border-green-500 text-green-500" : "text-amber-500"
              )}
            >
              {product.selectedQuantity 
                ? `${product.selectedQuantity.toLocaleString()} pcs` 
                : "En attente"}
            </Badge>
          </div>
        ))}
        
        {products.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <HelpCircle className="h-8 w-8 mb-2" />
            <p className="text-sm">Aucun produit en analyse</p>
          </div>
        )}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2" />
            <p className="text-sm">Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSummary;
