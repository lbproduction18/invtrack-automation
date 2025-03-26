
import React from 'react';
import { ArrowDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductsHeaderProps {
  title?: string;
  description?: string;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  title = "Produits",
  description = "Gérez votre catalogue de produits"
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="bg-background hover:bg-muted border-border"
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          Exporter
        </Button>
        <Button 
          className="bg-primary text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>
    </div>
  );
};
