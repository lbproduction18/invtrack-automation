
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, AlertCircle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/components/dashboard/low-stock/utils";
import { type Product } from "@/types/product";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';

type SelectedProduct = Product & { 
  selectedQuantity?: QuantityOption;
  weeks_delivery?: string | null; // Ajouté le champ weeks_delivery ici
};

interface ProductDetailsTableProps {
  products: SelectedProduct[];
  isLoading: boolean;
  onQuantityChange: (productId: string, quantity: QuantityOption) => void;
  getTotalPrice: (product: SelectedProduct) => number;
  onShowDetails: (index: number) => void;
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  products,
  isLoading,
  onQuantityChange,
  getTotalPrice,
  onShowDetails
}) => {
  const quantityOptions: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];

  return (
    <div className="rounded-md border border-[#272727] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#161616]">
          <TableRow className="hover:bg-transparent border-b border-[#272727]">
            <TableHead className="text-xs font-medium text-gray-400 w-[30%] text-left pl-3">SKU</TableHead>
            <TableHead className="text-xs font-medium text-gray-400 text-center">Stock Actuel</TableHead>
            <TableHead className="text-xs font-medium text-gray-400 text-center">Seuil</TableHead>
            <TableHead className="text-xs font-medium text-gray-400 text-center">Dernière Commande</TableHead>
            <TableHead className="text-xs font-medium text-gray-400 text-center">Délai</TableHead>
            <TableHead className="text-xs font-medium text-gray-400 text-center">Quantité</TableHead>
            <TableHead className="text-xs font-medium text-gray-400 text-center">Prix</TableHead>
            <TableHead className="text-xs font-medium text-gray-400 text-center">Actions</TableHead>
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
          ) : products.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-400">Aucun produit en analyse</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // Products table
            products.map((product, index) => (
              <TableRow key={product.id} className="hover:bg-[#161616]">
                <TableCell className="font-medium whitespace-nowrap pl-3">
                  <div className="flex flex-col">
                    <span>{product.SKU}</span>
                    {product.product_name && (
                      <span className="text-xs text-gray-400">{product.product_name}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={product.current_stock < product.threshold ? "text-red-500" : ""}>
                    {product.current_stock}
                  </span>
                </TableCell>
                <TableCell className="text-center text-gray-400">
                  {product.threshold}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {product.last_order_date ? (
                    <div className="flex flex-col items-center">
                      <span>{formatDate(product.last_order_date)}</span>
                      <span className="text-gray-400">{product.last_order_quantity} pcs</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                
                {/* Délai de livraison (texte) */}
                <TableCell className="text-center">
                  {product.weeks_delivery ? (
                    <span>{product.weeks_delivery}</span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                
                {/* Quantity selector */}
                <TableCell>
                  <Select
                    value={product.selectedQuantity?.toString() || undefined}
                    onValueChange={(value) => {
                      if (value) {
                        const qty = parseInt(value) as QuantityOption;
                        onQuantityChange(product.id, qty);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
                      {quantityOptions.map(qty => (
                        <SelectItem key={qty} value={qty.toString()}>
                          {qty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                
                <TableCell className="text-center">
                  {product.selectedQuantity ? (
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {getTotalPrice(product).toLocaleString()} $
                      </span>
                      <span className="text-xs text-gray-400">
                        {(getTotalPrice(product) / product.selectedQuantity * 1000).toFixed(2)} $ / 1000
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex justify-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => onShowDetails(index)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductDetailsTable;
