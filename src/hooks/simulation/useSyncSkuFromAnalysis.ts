
import { useEffect } from 'react';
import { useAnalysisItems } from '@/hooks/useAnalysisItems';
import { useProducts } from '@/hooks/useProducts';
import { useProductPrices } from '@/hooks/useProductPrices';
import { QuantityOption } from '@/components/inventory/AnalysisContent';
import { SelectedSKU } from '@/types/product';

/**
 * Hook to sync SKUs from analysis items to simulation
 */
export function useSyncSkuFromAnalysis(
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  handleOrderQuantityChange: (productId: string, quantityValue: string) => void
) {
  const { analysisItems } = useAnalysisItems();
  const { products } = useProducts('analysis');
  const { productPrices } = useProductPrices();
  
  // Predefined quantity options
  const standardQuantities: QuantityOption[] = [1000, 2000, 3000, 4000, 5000, 8000];
  
  useEffect(() => {
    // Get product quantities from analysis_items
    const quantities: Record<string, string> = {};
    
    // Also prepare to sync SKUs from analysis_items
    const syncedSKUs: Record<string, SelectedSKU[]> = {};
    
    analysisItems.forEach(item => {
      if (item.product_id && item.quantity_selected) {
        quantities[item.product_id] = item.quantity_selected.toString();
        handleOrderQuantityChange(item.product_id, item.quantity_selected.toString());
      }
      
      // If this analysis item has SKU information, sync it
      if (item.product_id && item.sku_code && item.sku_label) {
        const productInfo = products.find(p => p.id === item.product_id);
        if (productInfo) {
          // Find appropriate category/price entry for this SKU
          const skuParts = item.sku_code.split('-');
          const category = skuParts[0];
          
          // Find matching product price 
          const matchingPrice = productPrices.find(p => {
            const normalizedPriceName = p.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const normalizedCategory = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return normalizedPriceName.includes(normalizedCategory) || normalizedCategory.includes(normalizedPriceName);
          });
          
          if (matchingPrice) {
            if (!syncedSKUs[matchingPrice.product_name]) {
              syncedSKUs[matchingPrice.product_name] = [];
            }
            
            // Get appropriate price based on quantity
            const quantity = item.quantity_selected as unknown as QuantityOption || 1000;
            const priceField = `price_${quantity}` as keyof typeof matchingPrice;
            const price = matchingPrice[priceField] as number || 0;
            
            syncedSKUs[matchingPrice.product_name].push({
              productId: item.product_id,
              SKU: item.sku_code,
              productName: item.sku_label,
              quantity: quantity as number,
              price: price
            });
          }
        }
      }
    });
    
    // If we have synced SKUs, update the selected SKUs state
    if (Object.keys(syncedSKUs).length > 0) {
      setSelectedSKUs(syncedSKUs);
    }
  }, [analysisItems, products, productPrices, setSelectedSKUs, handleOrderQuantityChange]);
}
