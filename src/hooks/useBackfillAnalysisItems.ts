
import { useSKUBackfill } from './backfill/useSKUBackfill';
import { usePriceAssociation } from './backfill/usePriceAssociation';

export function useBackfillAnalysisItems() {
  const { 
    backfillSKUData, 
    isLoading, 
    isComplete 
  } = useSKUBackfill();
  
  const { 
    associatePrices, 
    isLoading: isPriceAssociationLoading, 
    isComplete: isPriceAssociationComplete 
  } = usePriceAssociation();

  return {
    backfillSKUData,
    associatePrices,
    isLoading,
    isComplete,
    isPriceAssociationLoading,
    isPriceAssociationComplete
  };
}
