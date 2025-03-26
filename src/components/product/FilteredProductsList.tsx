
import { type Product } from '@/types/product';

interface FilteredProductsListProps {
  products: Product[];
  searchQuery: string;
  stockFilter: string;
}

// Fonction utilitaire pour filtrer les produits
export const FilteredProductsList = ({
  products,
  searchQuery,
  stockFilter
}: FilteredProductsListProps): Product[] => {
  // Filtrer les produits en fonction de la recherche
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      searchQuery === '' || 
      product.SKU.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Add stock filtering if needed in the future
    // For now, just return the search match
    return matchesSearch;
  });

  return filteredProducts;
};
