
import React from 'react';
import { formatDate } from "@/components/product/utils/dateUtils";
import { type Product } from "@/types/product";

interface LastOrderInfoProps {
  lastOrderDate: string | null;
  lastOrderQuantity: number | null;
}

const LastOrderInfo: React.FC<LastOrderInfoProps> = ({ 
  lastOrderDate, 
  lastOrderQuantity 
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Dernière Commande</h3>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-gray-400">Date:</div>
        <div>{lastOrderDate ? formatDate(lastOrderDate) : "-"}</div>
        <div className="text-gray-400">Quantité:</div>
        <div>{lastOrderQuantity || "-"}</div>
      </div>
    </div>
  );
};

export default LastOrderInfo;
