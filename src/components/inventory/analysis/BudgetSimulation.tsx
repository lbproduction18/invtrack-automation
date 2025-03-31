
import React, { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAnalysisItems, type AnalysisItem } from '@/hooks/useAnalysisItems';
import { AnalysisProduct } from '@/components/inventory/AnalysisContent';
import AnalysisProductRow from './products-grid/AnalysisProductRow';
import { Loader2 } from 'lucide-react';

// Fix for TypeScript errors by extending the AnalysisItem to match AnalysisProduct requirements
const mapToAnalysisProduct = (analysisItem: AnalysisItem, products: any[]): AnalysisProduct => {
  // Find the matching product details
  const product = products.find(p => p.id === analysisItem.product_id);
  
  return {
    ...analysisItem,
    productDetails: product || null,
    // Add any missing properties to match AnalysisProduct interface
    price_1000: analysisItem.price_1000 || null,
    price_2000: analysisItem.price_2000 || null,
    price_3000: analysisItem.price_3000 || null,
    price_4000: analysisItem.price_4000 || null,
    price_5000: analysisItem.price_5000 || null,
    price_8000: analysisItem.price_8000 || null
  };
};

interface BudgetSimulationProps {
  budgetAmount: number;
  onProductsSelected?: (products: AnalysisItem[]) => void;
}

const BudgetSimulation: React.FC<BudgetSimulationProps> = ({ 
  budgetAmount,
  onProductsSelected 
}) => {
  const { products, isLoading: isProductsLoading } = useProducts('all');
  const { analysisItems, isLoading: isAnalysisLoading } = useAnalysisItems();
  
  const [selectedProducts, setSelectedProducts] = useState<AnalysisItem[]>([]);
  const [remainingBudget, setRemainingBudget] = useState<number>(budgetAmount);
  
  // Handles selection and deselection of products
  const toggleProductSelection = (product: AnalysisItem) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, product]);
    }
  };
  
  // Calculate remaining budget when selected products change
  useEffect(() => {
    const calculateBudget = () => {
      let totalCost = 0;
      selectedProducts.forEach(product => {
        // Assuming a default price if none is available
        const price = product.price_1000 || 50;
        totalCost += price;
      });
      setRemainingBudget(budgetAmount - totalCost);
    };
    
    calculateBudget();
  }, [selectedProducts, budgetAmount]);
  
  // Notify parent component when selected products change
  useEffect(() => {
    if (onProductsSelected) {
      onProductsSelected(selectedProducts);
    }
  }, [selectedProducts, onProductsSelected]);
  
  // Filter products based on priority badge
  const priorityProducts = analysisItems
    .filter(item => item.priority_badge === 'prioritaire');
  
  const mediumProducts = analysisItems
    .filter(item => item.priority_badge === 'moyen');
  
  const standardProducts = analysisItems
    .filter(item => item.priority_badge === 'standard');
  
  // Show loading state if data is still being fetched
  if (isProductsLoading || isAnalysisLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary mr-2" />
        <span>Chargement des produits...</span>
      </div>
    );
  }
  
  // Dummy function for toggle expand since we're not using it
  const handleToggleExpand = () => {};
  
  return (
    <div className="space-y-6">
      <div className="bg-[#161616] border border-[#272727] rounded-md p-4">
        <h3 className="text-sm font-medium mb-4">Produits prioritaires</h3>
        {priorityProducts.length > 0 ? (
          <div className="space-y-2">
            {priorityProducts.map(item => (
              <AnalysisProductRow
                key={item.id}
                item={mapToAnalysisProduct(item, products)}
                handleRowClick={() => toggleProductSelection(item)}
                toggleNoteExpansion={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
                refetchAnalysis={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucun produit prioritaire</p>
        )}
      </div>
      
      <div className="bg-[#161616] border border-[#272727] rounded-md p-4">
        <h3 className="text-sm font-medium mb-4">Produits de priorité moyenne</h3>
        {mediumProducts.length > 0 ? (
          <div className="space-y-2">
            {mediumProducts.map(item => (
              <AnalysisProductRow
                key={item.id}
                item={mapToAnalysisProduct(item, products)}
                handleRowClick={() => toggleProductSelection(item)}
                toggleNoteExpansion={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
                refetchAnalysis={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucun produit de priorité moyenne</p>
        )}
      </div>
      
      <div className="bg-[#161616] border border-[#272727] rounded-md p-4">
        <h3 className="text-sm font-medium mb-4">Produits standard</h3>
        {standardProducts.length > 0 ? (
          <div className="space-y-2">
            {standardProducts.map(item => (
              <AnalysisProductRow
                key={item.id}
                item={mapToAnalysisProduct(item, products)}
                handleRowClick={() => toggleProductSelection(item)}
                toggleNoteExpansion={(e) => {
                  e.stopPropagation();
                  handleToggleExpand();
                }}
                refetchAnalysis={() => {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Aucun produit standard</p>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-[#171717] border border-[#272727] rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Budget restant:</h3>
          <span className={`text-xl font-medium ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {remainingBudget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSimulation;
