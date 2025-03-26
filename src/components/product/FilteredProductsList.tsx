
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
  stockFilter = 'all',
  priorityFilter = 'all', // Default to all priorities
  sortBy = 'oldest' // Default to oldest items first
}: FilteredProductsListProps): Product[] => {
  if (!products || products.length === 0) {
    return [];
  }
  
  // Filtrer les produits en fonction de la recherche et des filtres
  const filteredProducts = products.filter((product: Product) => {
    // Filtre de recherche
    const matchesSearch = 
      searchQuery === '' || 
      product.SKU.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre de priorité
    const matchesPriority = 
      priorityFilter === 'all' || 
      product.priority_badge === priorityFilter;
    
    // Filtre de stock
    let matchesStock = true;
    if (stockFilter !== 'all') {
      if (stockFilter === 'out' && product.current_stock > 0) {
        matchesStock = false;
      } else if (stockFilter === 'low' && (product.current_stock === 0 || product.current_stock > product.threshold)) {
        matchesStock = false;
      } else if (stockFilter === 'normal' && (product.current_stock <= product.threshold)) {
        matchesStock = false;
      }
    }
    
    // Retourner true si tous les filtres correspondent
    return matchesSearch && matchesPriority && matchesStock;
  });

  // Sort the filtered products
  return [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'low-stock':
        // Prioritize first by stock ratio, then by actual stock
        const ratioA = a.current_stock / (a.threshold || 1);
        const ratioB = b.current_stock / (b.threshold || 1);
        return ratioA - ratioB || a.current_stock - b.current_stock;
      case 'high-stock':
        const ratioAHigh = a.current_stock / (a.threshold || 1);
        const ratioBHigh = b.current_stock / (b.threshold || 1);
        return ratioBHigh - ratioAHigh || b.current_stock - a.current_stock;
      default:
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
  });
};
