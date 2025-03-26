
import React from 'react';
import { 
  Table, 
  TableBody 
} from "@/components/ui/table";
import { type QuantityOption } from '@/components/inventory/AnalysisContent';
import { type SelectedSKU } from '@/types/product';
import SimulationTableHeader from './SimulationTableHeader';
import SimulationProductRow from './SimulationProductRow';

interface SimulationTableProps {
  productPrices: any[]; // ProductPrice type array
  isLoading: boolean;
  quantityOptions: QuantityOption[];
  selectedSKUs: Record<string, SelectedSKU[]>;
  groupedAnalysisProducts: Record<string, Array<{ id: string, SKU: string, productName: string | null }>>;
  trancheTotals: Record<QuantityOption, number>;
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
  trancheTotals,
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
              <td colSpan={9} className="h-24 text-center text-gray-500">
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
              <td colSpan={9} className="h-24 text-center text-gray-500">
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
          trancheTotals={trancheTotals} 
          simulationTotal={simulationTotal} 
        />
        
        <TableBody>
          {productPrices.map(product => {
            const productName = product.product_name;
            const availableSKUs = groupedAnalysisProducts[productName] || [];
            
            return (
              <SimulationProductRow
                key={product.id}
                product={product}
                productName={productName}
                quantityOptions={quantityOptions}
                availableSKUs={availableSKUs}
                selectedSKUs={selectedSKUs[productName] || []}
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
