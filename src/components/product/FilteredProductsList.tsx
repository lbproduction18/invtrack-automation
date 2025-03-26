
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
  // Filtrer les produits uniquement en fonction de la recherche
  // puisque nous n'avons plus les propriétés de stock
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return filteredProducts;
};
