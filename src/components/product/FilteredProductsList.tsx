
import { type Product } from '@/types/product';

interface FilteredProductsListProps {
  products: Product[];
  searchQuery: string;
  stockFilter: string;
}

// Convert from React component to a regular utility function
export const FilteredProductsList = ({
  products,
  searchQuery,
  stockFilter
}: FilteredProductsListProps): Product[] => {
  // Filtrer les produits en fonction de la recherche et du filtre de stock
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.SKU.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (stockFilter === 'all') {
      return matchesSearch;
    } else if (stockFilter === 'low') {
      return matchesSearch && product.current_stock <= product.threshold && product.current_stock > 0;
    } else if (stockFilter === 'out') {
      return matchesSearch && product.current_stock <= 0;
    } else if (stockFilter === 'normal') {
      return matchesSearch && product.current_stock > product.threshold;
    }
    
    return matchesSearch;
  });

  return filteredProducts;
};
