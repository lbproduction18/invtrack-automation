
import React from 'react';
import { 
  Table, TableBody, TableHeader, TableRow 
} from "@/components/ui/table";
import { AlertCircle, Calendar, FileText, Truck, ClipboardCheck } from 'lucide-react';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';
import AnalysisTableHeader from './AnalysisTableHeader';
import AnalysisProductRow from './AnalysisProductRow';
import ExpandedNoteRow from './ExpandedNoteRow';
import { cn } from '@/lib/utils';

interface AnalysisProductsTableProps {
  analysisProducts: AnalysisProduct[];
  isLoading: boolean;
  expandedNoteId: string | null;
  handleRowClick: (product: AnalysisProduct) => void;
  toggleNoteExpansion: (e: React.MouseEvent, productId: string) => void;
  refetchAnalysis: () => void;
}

const AnalysisProductsTable: React.FC<AnalysisProductsTableProps> = ({
  analysisProducts,
  isLoading,
  expandedNoteId,
  handleRowClick,
  toggleNoteExpansion,
  refetchAnalysis
}) => {
  // Function to check if a product row is complete (all key fields filled)
  const isProductComplete = (product: AnalysisProduct): boolean => {
    return Boolean(
      product.last_order_quantity && 
      product.last_order_date && 
      product.weeks_delivery && 
      product.lab_status
    );
  };

  return (
    <div className="rounded-md border border-[#272727] overflow-hidden shadow-md">
      <Table>
        <TableHeader className="bg-gradient-to-r from-[#161616] to-[#181818] sticky top-0 z-50">
          <TableRow className="hover:bg-transparent border-b border-[#2A2A2A]">
            <AnalysisTableHeader
              columns={[
                { id: 'sku', title: 'SKU', icon: ClipboardCheck },
                { id: 'stock', title: 'Stock', icon: null },
                { id: 'threshold', title: 'Seuil', icon: null },
                { id: 'note', title: 'Note', icon: FileText },
                { id: 'last_order', title: 'Dernière Commande', icon: null },
                { id: 'last_order_date', title: 'Date Dernière Cmd', icon: Calendar },
                { id: 'lab_status', title: 'Étiquette Labo', icon: null },
                { id: 'delivery', title: 'Délai Livraison', icon: Truck },
                { id: 'actions', title: 'Actions', icon: null }
              ]}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <td colSpan={9} className="h-16">
                  <div className="w-full h-full animate-pulse bg-[#161616]/50 rounded-md" />
                </td>
              </TableRow>
            ))
          ) : analysisProducts.length === 0 ? (
            <TableRow>
              <td colSpan={9} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center p-6">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-400 font-medium">Aucun produit en analyse</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Ajoutez des produits à l'analyse depuis la section "Observation"
                  </p>
                </div>
              </td>
            </TableRow>
          ) : (
            analysisProducts.map((item, index) => (
              <React.Fragment key={item.id}>
                <AnalysisProductRow 
                  item={item}
                  handleRowClick={handleRowClick}
                  toggleNoteExpansion={toggleNoteExpansion}
                  refetchAnalysis={refetchAnalysis}
                  isComplete={isProductComplete(item)}
                  isAlternate={index % 2 === 1}
                />
                
                {/* Expanded note row */}
                {expandedNoteId === item.id && item.note && (
                  <ExpandedNoteRow 
                    note={item.note} 
                    dateAdded={item.date_added || item.created_at} 
                  />
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnalysisProductsTable;
