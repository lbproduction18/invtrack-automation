
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingUp, Archive, AlertTriangle } from "lucide-react";

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
  const progressPercentage = productCount > 0 ? (configuredProductCount / productCount) * 100 : 0;
  
  return (
    <div className="bg-gradient-to-br from-[#161616] to-[#121212] rounded-lg p-5 border border-[#272727] shadow-lg">
      <h3 className="text-sm font-medium mb-4 text-white flex items-center">
        <TrendingUp className="h-4 w-4 mr-2 text-[#3ECF8E]" />
        Résumé du Budget
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm bg-[#1E1E1E]/50 p-3 rounded-md">
          <span className="text-gray-400 flex items-center">
            <Archive className="h-3.5 w-3.5 mr-2 text-gray-500" />
            Total Produits:
          </span>
          <span className="font-medium text-white">{productCount}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm bg-[#1E1E1E]/50 p-3 rounded-md">
          <span className="text-gray-400">Total Budget:</span>
          <span className="font-semibold text-white">
            {totalBudget.toLocaleString()} €
            <span className="ml-1 text-xs text-[#3ECF8E]">€</span>
          </span>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400 flex items-center">
              <AlertTriangle className="h-3.5 w-3.5 mr-2 text-amber-500" />
              Produits configurés:
            </span>
            <span>
              <span className="font-medium">{configuredProductCount}</span>
              <span className="text-gray-500"> / {productCount}</span>
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 w-full bg-[#1E1E1E] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-[#3ECF8E] rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          className="w-full bg-gradient-to-r from-emerald-600 to-[#3ECF8E] border-0 hover:shadow-lg hover:from-emerald-700 hover:to-emerald-600 transition-all"
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
