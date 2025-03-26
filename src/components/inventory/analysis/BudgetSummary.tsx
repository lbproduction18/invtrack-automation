
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface BudgetSummaryProps {
  productCount: number;
  totalBudget: number;
  configuredProductCount: number;
  onCreateOrder: () => void;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  productCount,
  totalBudget,
  configuredProductCount,
  onCreateOrder
}) => {
  return (
    <div className="bg-[#161616] rounded-md p-4 border border-[#272727]">
      <h3 className="text-sm font-medium mb-2">Résumé du Budget</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Produits:</span>
          <span>{productCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Budget:</span>
          <span className="font-semibold">{totalBudget.toLocaleString()} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Produits configurés:</span>
          <span>
            {configuredProductCount} / {productCount}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Button 
          className="w-full"
          onClick={onCreateOrder}
          disabled={configuredProductCount === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Créer le Bon de Commande
        </Button>
      </div>
    </div>
  );
};

export default BudgetSummary;
