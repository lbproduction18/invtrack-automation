
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, HelpCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";

type QuantityOption = 1000 | 2000 | 3000 | 4000 | 5000;
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
    <div className="bg-gradient-to-br from-[#161616] to-[#121212] rounded-lg p-5 border border-[#272727] shadow-lg">
      <h3 className="text-sm font-medium mb-4 text-white flex items-center">
        <CheckCircle2 className="h-4 w-4 mr-2 text-[#3ECF8E]" />
        Liste des Produits
      </h3>
      
      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#272727] scrollbar-track-transparent">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="flex justify-between items-center text-sm p-3 hover:bg-[#1E1E1E] rounded-md cursor-pointer transition-colors group border border-transparent hover:border-[#272727]/50"
            onClick={() => onShowDetails(index)}
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              {product.selectedQuantity ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
              )}
              <span className="truncate max-w-[120px]">{product.SKU}</span>
            </div>
            
            <div className="flex items-center">
              <Badge 
                variant={product.selectedQuantity ? "outline" : "secondary"}
                className={cn(
                  "text-xs mr-2",
                  product.selectedQuantity ? "border-green-500 text-green-500" : "text-amber-500"
                )}
              >
                {product.selectedQuantity 
                  ? `${product.selectedQuantity.toLocaleString()} pcs` 
                  : "En attente"}
              </Badge>
              <ChevronRight className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
        
        {products.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 bg-[#141414]/50 rounded-lg border border-dashed border-[#272727]">
            <HelpCircle className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">Aucun produit en analyse</p>
          </div>
        )}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3ECF8E] mb-2" />
            <p className="text-sm">Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSummary;
