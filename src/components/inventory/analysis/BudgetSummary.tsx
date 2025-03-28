
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetSummaryProps {
  productCount: number;
  totalBudget: number;
  configuredProductCount: number;
  totalProductCount?: number;
  onCreateOrder: () => void;
  isLoading?: boolean;
  totalOrderAmount?: number;
  depositAmount?: number;
  budgetPercentage?: number;
  budgetAmount?: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  productCount = 0,
  totalBudget = 0,
  configuredProductCount = 0,
  totalProductCount = 0,
  onCreateOrder,
  isLoading = false,
  totalOrderAmount = 0,
  depositAmount = 0,
  budgetPercentage = 0,
  budgetAmount = 300000
}) => {
  // Safely format numbers with toLocaleString to prevent the error
  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || isNaN(Number(value))) {
      return '0';
    }
    return value.toLocaleString();
  };

  return (
    <div className="bg-[#161616] rounded-md p-4 border border-[#272727]">
      <h3 className="text-sm font-medium mb-2">Résumé du Budget</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Produits:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <span>{productCount}</span>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Budget:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <span className="font-semibold">{formatNumber(budgetAmount)} $</span>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Commande:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <span className="font-semibold">{formatNumber(totalOrderAmount)} $</span>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Produits configurés:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <span>
              {configuredProductCount} / {totalProductCount || productCount}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Button 
          className="w-full"
          onClick={onCreateOrder}
          disabled={configuredProductCount === 0 || isLoading}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Créer le Bon de Commande
        </Button>
      </div>
    </div>
  );
};

export default BudgetSummary;
