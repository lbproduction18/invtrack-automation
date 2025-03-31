
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import { type ProductPrice } from '@/hooks/useProductPrices';
import { updateAnalysisItemQuantity } from './skuAnalysisHelpers';
import { findMatchingProductPrice } from './skuPriceHelpers';

/**
 * Hook for managing SKU quantities in the simulation
 */
export function useSkuQuantity(
  setSelectedSKUs: React.Dispatch<React.SetStateAction<Record<string, SelectedSKU[]>>>,
  productPrices: ProductPrice[],
  analysisItems: any[]
) {
  const handleQuantityChange = (
    productName: string, 
    skuIndex: number, 
    quantity: QuantityOption
  ) => {
    console.log(`Changing quantity - Product: ${productName}, Index: ${skuIndex}, Quantity: ${quantity}`);
    
    setSelectedSKUs(prev => {
      const updatedSKUs = [...(prev[productName] || [])];
      
      if (updatedSKUs[skuIndex]) {
        const sku = updatedSKUs[skuIndex];
        
        const skuParts = sku.SKU.split('-');
        const productCategory = skuParts[0];
        
        const productPrice = findMatchingProductPrice(productCategory, productPrices);
        
        const priceField = `price_${quantity}` as keyof typeof productPrice;
        const price = productPrice ? (productPrice[priceField] as number || 0) : 0;
        
        console.log(`Found price ${price} for quantity ${quantity}`);
        
        updatedSKUs[skuIndex] = {
          ...updatedSKUs[skuIndex],
          quantity,
          price
        };
        
        if (sku.productId) {
          updateAnalysisItemQuantity(sku.productId, quantity, productPrice, analysisItems);
        }
      }
      
      return {
        ...prev,
        [productName]: updatedSKUs
      };
    });
  };

  return { handleQuantityChange };
}

export default useSkuQuantity;
