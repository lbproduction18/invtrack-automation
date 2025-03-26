
import { type Product } from '@/types/product';

export type SortOption = 'oldest' | 'newest' | 'low-stock' | 'high-stock';

interface FilteredProductsListProps {
  products: Product[];
  searchQuery: string;
  stockFilter: string;
  sortBy: SortOption;
  priorityFilter: boolean;
}

// Fonction utilitaire pour filtrer les produits
export const FilteredProductsList = ({
  products,
  searchQuery,
  stockFilter,
  sortBy = 'oldest', // Default to oldest items first
  priorityFilter = false
}: FilteredProductsListProps): Product[] => {
  // Filtrer les produits en fonction de la recherche
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      searchQuery === '' || 
      product.SKU.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Appliquer le filtre de priorité si activé
    const matchesPriority = priorityFilter 
      ? product.threshold > 5 // Considérer comme prioritaire si le seuil est élevé (> 5)
      : true;
    
    // Add stock filtering if needed in the future
    // For now, just return the search match
    return matchesSearch && matchesPriority;
  });

  // Sort the filtered products
  return [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'low-stock':
        return a.current_stock - b.current_stock;
      case 'high-stock':
        return b.current_stock - a.current_stock;
      default:
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
  });
};
