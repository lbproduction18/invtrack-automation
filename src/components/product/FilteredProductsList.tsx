
import { type Product } from '@/types/product';

export type SortOption = 'oldest' | 'newest' | 'low-stock' | 'high-stock';

interface FilteredProductsListProps {
  products: Product[];
  searchQuery: string;
  stockFilter: string;
  priorityFilter: string;
  sortBy: SortOption;
}

// Fonction utilitaire pour filtrer les produits
export const FilteredProductsList = ({
  products,
  searchQuery,
  stockFilter,
  priorityFilter = 'all', // Default to all priorities
  sortBy = 'oldest' // Default to oldest items first
}: FilteredProductsListProps): Product[] => {
  // Filtrer les produits en fonction de la recherche
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      searchQuery === '' || 
      product.SKU.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = 
      priorityFilter === 'all' || 
      product.priority_badge === priorityFilter;
    
    // Add stock filtering if needed in the future
    // For now, just return the search and priority match
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
