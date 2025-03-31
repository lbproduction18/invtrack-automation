
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatTotalPrice, formatPrice } from './PriceFormatter';
import { X } from "lucide-react";

interface SelectedSKUsListProps {
  productId: string;
  skus: string[];
  quantities: Record<string, string>;
  calculatedPrices: Record<string, number | string>;
  onQuantityChange: (productId: string, sku: string, quantityValue: string) => void;
  onRemoveSKU: (productId: string, sku: string) => void;
  hasOnlyPrice8000?: boolean;
  showDetailedSummary?: boolean;
  selectedSKUDetails?: Array<{
    sku: string;
    quantity: string;
    unitPrice: number;
    totalPrice: number;
    productName?: string;
  }>;
}

const SelectedSKUsList: React.FC<SelectedSKUsListProps> = ({
  productId,
  skus,
  quantities,
  calculatedPrices,
  onQuantityChange,
  onRemoveSKU,
  hasOnlyPrice8000 = false,
  showDetailedSummary = false,
  selectedSKUDetails = []
}) => {
  // If no SKUs are selected or if we're showing the full summary view
  if ((!skus || skus.length === 0) && !showDetailedSummary) {
    return null;
  }
  
  // Show the product-specific SKU selection table
  if (!showDetailedSummary) {
    return (
      <div className="w-full p-2 rounded-md border border-[#272727] bg-[#161616] mb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">SKU</TableHead>
              <TableHead className="w-[20%] text-center">Quantité</TableHead>
              <TableHead className="w-[30%] text-center">Prix</TableHead>
              <TableHead className="w-[10%] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skus.map((sku) => {
              const quantityValue = quantities[sku] || '';
              const calculatedPrice = calculatedPrices[sku] || '';
              const isErrorMessage = typeof calculatedPrice === 'string' && calculatedPrice.length > 0;
              
              return (
                <TableRow key={sku} className="hover:bg-[#1a1a1a]">
                  <TableCell className="py-1">{sku}</TableCell>
                  <TableCell className="py-1 text-center">
                    <input
                      type="number"
                      className="w-20 px-2 py-1 text-sm border border-[#403E43] rounded-md bg-[#0F0F0F] text-center"
                      value={quantityValue}
                      onChange={(e) => onQuantityChange(productId, sku, e.target.value)}
                      min="1"
                      step={hasOnlyPrice8000 ? "8000" : "1"}
                      placeholder={hasOnlyPrice8000 ? "8000" : "Qté"}
                    />
                  </TableCell>
                  <TableCell className={`py-1 text-center ${isErrorMessage ? 'text-red-500 text-xs' : ''}`}>
                    {isErrorMessage 
                      ? <span className="text-xs">{calculatedPrice}</span>
                      : typeof calculatedPrice === 'number' ? formatTotalPrice(calculatedPrice) : ''}
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    <button
                      onClick={() => onRemoveSKU(productId, sku)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  // Show the detailed summary view with all selected SKUs
  return (
    <div className="w-full rounded-md border border-[#272727] bg-[#161616] mb-2">
      <div className="p-3 border-b border-[#272727]">
        <h3 className="text-sm font-medium">Récapitulatif détaillé</h3>
      </div>
      <div className="p-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[35%]">SKU</TableHead>
              <TableHead className="w-[25%]">Produit</TableHead>
              <TableHead className="w-[15%] text-center">Quantité</TableHead>
              <TableHead className="w-[15%] text-center">Prix unitaire</TableHead>
              <TableHead className="w-[15%] text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedSKUDetails.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  Aucun produit sélectionné dans la simulation
                </TableCell>
              </TableRow>
            ) : (
              selectedSKUDetails.map((detail) => (
                <TableRow key={detail.sku} className="hover:bg-[#1a1a1a]">
                  <TableCell className="py-1 text-sm">{detail.sku}</TableCell>
                  <TableCell className="py-1 text-sm">{detail.productName || '-'}</TableCell>
                  <TableCell className="py-1 text-center text-sm">{detail.quantity}</TableCell>
                  <TableCell className="py-1 text-center text-sm">{formatPrice(detail.unitPrice)}</TableCell>
                  <TableCell className="py-1 text-right text-sm">{formatTotalPrice(detail.totalPrice)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SelectedSKUsList;
