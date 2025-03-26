
import React from 'react';
import { 
  Table, 
  TableBody 
} from "@/components/ui/table";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import SimulationTableHeader from './SimulationTableHeader';
import SimulationProductRow from './SimulationProductRow';
import { type ProductPrice } from '@/hooks/useProductPrices';

interface SimulationTableProps {
  productPrices: ProductPrice[]; 
  isLoading: boolean;
  quantityOptions: QuantityOption[];
  selectedSKUs: Record<string, SelectedSKU[]>;
  groupedAnalysisProducts: Record<string, Array<{ id: string, SKU: string, productName: string | null }>>;
  simulationTotal: number;
  onAddSKU: (productName: string, skuInfo: { id: string, SKU: string, productName: string | null }) => void;
  onQuantityChange: (productName: string, skuIndex: number, quantity: QuantityOption) => void;
  onRemoveSKU: (productName: string, skuIndex: number) => void;
  calculateSKUTotal: (sku: SelectedSKU) => number;
}

const SimulationTable: React.FC<SimulationTableProps> = ({
  productPrices,
  isLoading,
  quantityOptions,
  selectedSKUs,
  groupedAnalysisProducts,
  simulationTotal,
  onAddSKU,
  onQuantityChange,
  onRemoveSKU,
  calculateSKUTotal
}) => {
  if (isLoading) {
    return (
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <Table>
          <tbody>
            <tr>
              <td colSpan={quantityOptions.length + 2} className="h-24 text-center text-gray-500">
                Chargement des prix...
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  if (productPrices.length === 0) {
    return (
      <div className="rounded-md border border-[#272727] overflow-hidden">
        <Table>
          <tbody>
            <tr>
              <td colSpan={quantityOptions.length + 2} className="h-24 text-center text-gray-500">
                Aucun produit trouvé dans la base de données
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[#272727] overflow-hidden">
      <Table>
        <SimulationTableHeader 
          quantityOptions={quantityOptions} 
          simulationTotal={simulationTotal} 
          showSkuColumn={true}
        />
        
        <TableBody>
          {productPrices.map(product => {
            const productName = product.product_name;
            const availableSKUs = groupedAnalysisProducts[productName] || [];
            
            return (
              <SimulationProductRow
                key={product.id}
                productName={productName}
                productPrices={productPrices}
                isLoading={isLoading}
                quantityOptions={quantityOptions}
                selectedSKUs={selectedSKUs}
                groupedSKUs={availableSKUs}
                onAddSKU={onAddSKU}
                onQuantityChange={onQuantityChange}
                onRemoveSKU={onRemoveSKU}
                calculateSKUTotal={calculateSKUTotal}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SimulationTable;
