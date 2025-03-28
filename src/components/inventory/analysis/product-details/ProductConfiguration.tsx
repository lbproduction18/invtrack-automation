
import React from 'react';
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Product } from "@/types/product";

interface ProductConfigurationProps {
  labStatus: string | null;
  estimatedDeliveryDate: string | null;
  weeksDelivery: string | null;
  onUpdateProduct: (productId: string, updates: Partial<Product> | { weeks_delivery?: string }) => void;
  productId: string;
}

const ProductConfiguration: React.FC<ProductConfigurationProps> = ({
  labStatus,
  estimatedDeliveryDate,
  weeksDelivery,
  onUpdateProduct,
  productId
}) => {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-400 mb-1">Étiquette au laboratoire</p>
        <Select
          value={labStatus || undefined}
          onValueChange={(value) => {
            onUpdateProduct(productId, { lab_status: value });
          }}
        >
          <SelectTrigger className="w-full bg-[#121212] border-[#272727]">
            <SelectValue placeholder="Choisir un statut" />
          </SelectTrigger>
          <SelectContent className="bg-[#161616] border-[#272727] z-[100]">
            <SelectItem value="OK">OK</SelectItem>
            <SelectItem value="À commander">À commander</SelectItem>
            <SelectItem value="Manquante">Manquante</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <p className="text-sm text-gray-400 mb-1">Date de livraison estimée</p>
        <div className="relative">
          <input 
            type="date" 
            className="w-full px-3 py-2 bg-[#121212] border border-[#272727] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={estimatedDeliveryDate || ""}
            onChange={(e) => {
              onUpdateProduct(productId, { 
                estimated_delivery_date: e.target.value || null 
              });
            }}
          />
          <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-1">Délai de livraison (semaines)</p>
        <Input
          type="text"
          className="w-full px-3 py-2 bg-[#121212] border border-[#272727] rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={weeksDelivery || ""}
          placeholder="Ex: 6, 6-8, ~6..."
          onChange={(e) => {
            onUpdateProduct(productId, { 
              weeks_delivery: e.target.value 
            });
          }}
        />
      </div>
    </div>
  );
};

export default ProductConfiguration;
