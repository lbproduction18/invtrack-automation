
import { useState, useEffect } from 'react';
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useSkuAddition, useSkuRemoval } from './simulation/useSkuOperations';
import { useSkuQuantity } from './simulation/useSkuQuantity';
import { getQuantityOptions } from './simulation/skuPriceHelpers';

export function useSimulationSKUs(
  selectedSKUs: Record<string, SelectedSKU[]>,
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  productPrices: ProductPrice[]
) {
  const { analysisItems, updateAnalysisItem } = useAnalysisItems();
  const quantityOptions: QuantityOption[] = getQuantityOptions();

  // Log selected SKUs for debugging
  useEffect(() => {
    console.log("Current selected SKUs:", selectedSKUs);
  }, [selectedSKUs]);

  // Use our extracted hooks
  const { handleAddSKU } = useSkuAddition(selectedSKUs, setSelectedSKUs, productPrices, quantityOptions);
  const { handleRemoveSKU } = useSkuRemoval(setSelectedSKUs, analysisItems, updateAnalysisItem);
  const { handleQuantityChange } = useSkuQuantity(setSelectedSKUs, productPrices, analysisItems);

  return {
    quantityOptions,
    handleAddSKU,
    handleRemoveSKU,
    handleQuantityChange
  };
}
