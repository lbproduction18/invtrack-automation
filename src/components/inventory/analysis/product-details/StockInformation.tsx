
import React from 'react';
import { formatDate } from "@/components/product/utils/dateUtils";
import { type Product } from "@/types/product";

interface StockInformationProps {
  product: Product;
}

const StockInformation: React.FC<StockInformationProps> = ({ product }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Informations de Stock</h3>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-gray-400">Stock Actuel:</div>
        <div className={product.current_stock < product.threshold ? "text-red-500" : ""}>
          {product.current_stock}
        </div>
        <div className="text-gray-400">Seuil:</div>
        <div>{product.threshold}</div>
        <div className="text-gray-400">Priorité:</div>
        <div>{product.priority_badge}</div>
        <div className="text-gray-400">Date d'ajout:</div>
        <div>{formatDate(product.created_at)}</div>
      </div>
    </div>
  );
};

export default StockInformation;
