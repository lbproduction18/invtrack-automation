
import React from 'react';
import { formatDate } from "@/components/product/utils/dateUtils";
import { type Product } from "@/types/product";
import { differenceInWeeks } from 'date-fns';

interface LastOrderInfoProps {
  lastOrderDate: string | null;
  lastOrderQuantity: number | null;
}

const LastOrderInfo: React.FC<LastOrderInfoProps> = ({ 
  lastOrderDate, 
  lastOrderQuantity 
}) => {
  const getWeeksSince = (dateString: string | null): string => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    const now = new Date();
    const weeks = differenceInWeeks(now, date);
    
    return `${weeks} semaine${weeks !== 1 ? 's' : ''}`;
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Dernière Commande</h3>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <div className="text-gray-400">Date:</div>
        <div>
          {lastOrderDate ? (
            <>
              {formatDate(lastOrderDate)} 
              <span className="text-xs text-gray-400 block">
                {getWeeksSince(lastOrderDate)}
              </span>
            </>
          ) : "-"}
        </div>
        <div className="text-gray-400">Quantité:</div>
        <div>{lastOrderQuantity || "-"}</div>
      </div>
    </div>
  );
};

export default LastOrderInfo;
