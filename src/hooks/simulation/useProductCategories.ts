
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';

// Function to create product categories
export function useProductCategories(products: Product[]) {
  const [categories, setCategories] = useState<Record<string, Product[]>>({});
  
  useEffect(() => {
    if (!products.length) return;
    
    // Group products by first letter
    const groupedProducts = products.reduce((acc, product) => {
      // Extract the first letter of the product name and uppercase it
      const firstLetter = product.product_name.charAt(0).toUpperCase();
      
      // Initialize the category array if it doesn't exist
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      
      // Add the product to its category
      acc[firstLetter].push(product);
      
      return acc;
    }, {} as Record<string, Product[]>);
    
    // Sort categories alphabetically
    const sortedCategories = Object.keys(groupedProducts)
      .sort()
      .reduce((obj, key) => {
        obj[key] = groupedProducts[key];
        return obj;
      }, {} as Record<string, Product[]>);
    
    setCategories(sortedCategories);
  }, [products]);
  
  return { categories };
}
