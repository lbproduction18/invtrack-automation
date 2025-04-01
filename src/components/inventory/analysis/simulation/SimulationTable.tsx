
import React, { useEffect } from 'react';
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
  groupedAnalysisProducts: Record<string, Array<{ id: string, SKU: string, productName: string }>>;
  simulationTotal: number;
  onAddSKU: (productName: string, skuInfo: { id: string, SKU: string, productName: string }) => void;
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
  useEffect(() => {
    console.log("SimulationTable - Product Prices:", productPrices);
    console.log("SimulationTable - Grouped Analysis Products:", groupedAnalysisProducts);
  }, [productPrices, groupedAnalysisProducts]);

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
    <div className="rounded-md border border-[#272727] overflow-hidden relative">
      <Table>
        <SimulationTableHeader 
          quantityOptions={quantityOptions} 
          simulationTotal={simulationTotal} 
          showSkuColumn={true}
        />
        
        <TableBody className="relative">
          {Object.keys(groupedAnalysisProducts).length === 0 ? (
            <tr>
              <td colSpan={quantityOptions.length + 2} className="h-24 text-center text-gray-500">
                Aucun produit en analyse trouvé
              </td>
            </tr>
          ) : (
            Object.entries(groupedAnalysisProducts).map(([productName, skus]) => {
              const matchingPrice = productPrices.find(price => {
                // Case insensitive comparison and normalize accents
                const normalizedProductName = price.product_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const normalizedCategory = productName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                return normalizedProductName.includes(normalizedCategory) || normalizedCategory.includes(normalizedProductName);
              });
              
              if (matchingPrice) {
                return (
                  <SimulationProductRow
                    key={productName}
                    productName={matchingPrice.product_name}
                    productPrices={productPrices}
                    isLoading={isLoading}
                    quantityOptions={quantityOptions}
                    selectedSKUs={selectedSKUs}
                    groupedSKUs={skus}
                    onAddSKU={onAddSKU}
                    onQuantityChange={onQuantityChange}
                    onRemoveSKU={onRemoveSKU}
                    calculateSKUTotal={calculateSKUTotal}
                  />
                );
              }
              return null;
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SimulationTable;
