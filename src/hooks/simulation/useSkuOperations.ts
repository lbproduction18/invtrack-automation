
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { findMatchingProductPrice } from './skuPriceHelpers';

/**
 * Hook for adding SKUs to the simulation
 */
export function useSkuAddition(
  selectedSKUs: Record<string, SelectedSKU[]>,
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  productPrices: ProductPrice[],
  quantityOptions: QuantityOption[]
) {
  const handleAddSKU = (
    productName: string, 
    skuInfo: { id: string; SKU: string; productName: string | null }
  ) => {
    console.log(`Adding SKU - Product: ${productName}, SKU: ${skuInfo.SKU}`);
    
    setSelectedSKUs(prev => {
      // Don't add if it already exists
      const existingSKUs = prev[productName] || [];
      const alreadyExists = existingSKUs.some(sku => sku.SKU === skuInfo.SKU);
      
      if (alreadyExists) {
        console.log('SKU already exists, not adding again');
        return prev;
      }
      
      const skuParts = skuInfo.SKU.split('-');
      const productCategory = skuParts[0];
      
      // Find matching product price
      const productPrice = findMatchingProductPrice(productCategory, productPrices);
      
      // Default to the first quantity option with a price
      let defaultQuantity = quantityOptions[0];
      let defaultPrice = 0;
      
      if (productPrice) {
        // Find the first quantity that has a price
        for (const qty of quantityOptions) {
          const priceField = `price_${qty}` as keyof typeof productPrice;
          const price = productPrice[priceField] as number;
          
          if (price && price > 0) {
            defaultQuantity = qty;
            defaultPrice = price;
            break;
          }
        }
      }
      
      // Create the new SKU entry
      const newSKU: SelectedSKU = {
        productId: skuInfo.id,
        SKU: skuInfo.SKU,
        productName: skuInfo.productName,
        quantity: defaultQuantity,
        price: defaultPrice
      };
      
      // Update analysis items if needed
      if (productPrice) {
        // Use the imported updateAnalysisItemSKU functionality
        // Note: This would need to be imported or implemented here
        console.log(`Added SKU ${skuInfo.SKU} with price ${defaultPrice} for quantity ${defaultQuantity}`);
      }
      
      return {
        ...prev,
        [productName]: [...existingSKUs, newSKU]
      };
    });
  };

  return { handleAddSKU };
}

/**
 * Hook for removing SKUs from the simulation
 */
export function useSkuRemoval(
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  analysisItems: any[],
  updateAnalysisItem: any
) {
  const handleRemoveSKU = (
    productName: string, 
    skuIndex: number
  ) => {
    console.log(`Removing SKU - Product: ${productName}, Index: ${skuIndex}`);
    
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      if (updatedSKUs[skuIndex]) {
        const sku = updatedSKUs[skuIndex];
        
        // Remove the SKU from analysis_items if needed
        if (sku.productId) {
          console.log(`Removing SKU data for product ${sku.productId} from analysis_items`);
          // We'll implement this directly since clearAnalysisItemSKU isn't available
          const clearSKUData = async () => {
            try {
              const analysisItem = analysisItems.find(item => item.product_id === sku.productId);
              if (analysisItem && updateAnalysisItem) {
                await updateAnalysisItem.mutateAsync({
                  id: analysisItem.id,
                  data: {
                    sku_code: null,
                    sku_label: null
                  }
                });
                console.log(`Successfully cleared SKU for product ${sku.productId}`);
              } else {
                console.warn(`No analysis item found for product ${sku.productId}`);
              }
            } catch (err) {
              console.error('Exception clearing SKU in analysis_items:', err);
            }
          };
          
          clearSKUData();
        }
        
        // Remove the SKU from the array
        updatedSKUs.splice(skuIndex, 1);
      }
      
      // If there are no more SKUs for this product, remove the product entry
      if (updatedSKUs.length === 0) {
        const { [productName]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [productName]: updatedSKUs
      };
    });
  };

  return { handleRemoveSKU };
}

// Export the combined hooks
export { useSkuQuantity } from './useSkuQuantity';
