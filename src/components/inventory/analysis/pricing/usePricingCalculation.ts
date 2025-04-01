
import { useMemo } from 'react';
import { AnalysisItem } from '@/types/analysisItem';
import { calculateItemTotal, calculateSimulationTotal } from './utils/priceCalculationUtils';

export function usePricingCalculation(
  analysisItems: AnalysisItem[],
  quantities: Record<string, number>,
  priceTiers: string[]
) {
  // Calculate pricing based on quantities and selected items
  const calculationResults = useMemo(() => {
    const results = {
      itemTotals: {} as Record<string, number>,
      simulationTotal: 0,
      itemsByPriceTier: {} as Record<string, AnalysisItem[]>,
      totalsByPriceTier: {} as Record<string, number>
    };

    if (!analysisItems) {
      return results;
    }

    // Calculate individual item totals
    analysisItems.forEach(item => {
      if (!item.id || !item.sku_code) return;
      
      const quantity = quantities[item.id] || 0;
      const itemTotal = calculateItemTotal(item, quantity);
      
      if (itemTotal !== null) {
        results.itemTotals[item.id] = itemTotal;
      }
    });

    // Group items by price tier
    priceTiers.forEach(tier => {
      results.itemsByPriceTier[tier] = [];
      results.totalsByPriceTier[tier] = 0;
    });

    // Calculate totals by price tier
    analysisItems.forEach(item => {
      if (!item.id) return;
      
      const quantity = quantities[item.id] || 0;
      
      // Skip items with zero quantity
      if (quantity === 0) return;
      
      // Find which price tier is used for this quantity
      let selectedTier = '';
      
      if (quantity <= 1000) selectedTier = 'price_1000';
      else if (quantity <= 2000) selectedTier = 'price_2000';
      else if (quantity <= 3000) selectedTier = 'price_3000';
      else if (quantity <= 4000) selectedTier = 'price_4000';
      else if (quantity <= 5000) selectedTier = 'price_5000';
      else selectedTier = 'price_8000';
      
      if (selectedTier && results.itemsByPriceTier[selectedTier]) {
        results.itemsByPriceTier[selectedTier].push(item);
        
        // Add to the total for this tier
        const itemTotal = results.itemTotals[item.id] || 0;
        results.totalsByPriceTier[selectedTier] += itemTotal;
      }
    });

    // Calculate grand total
    results.simulationTotal = calculateSimulationTotal(analysisItems, quantities);

    return results;
  }, [analysisItems, quantities, priceTiers]);

  return calculationResults;
}
