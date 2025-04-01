
import React from 'react';
import { 
  Table, TableBody, TableHeader, TableRow 
} from "@/components/ui/table";
import { AlertCircle } from 'lucide-react';
import { type AnalysisProduct } from '@/components/inventory/AnalysisContent';
import AnalysisTableHeader from './AnalysisTableHeader';
import AnalysisProductRow from './AnalysisProductRow';
import ExpandedNoteRow from './ExpandedNoteRow';

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
  return (
    <div className="rounded-md border border-[#272727] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#161616]">
          <AnalysisTableHeader />
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                <td colSpan={9} className="h-16">
                  <div className="w-full h-full animate-pulse bg-[#161616]/50" />
                </td>
              </TableRow>
            ))
          ) : analysisProducts.length === 0 ? (
            <TableRow>
              <td colSpan={9} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-400">Aucun produit en analyse</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Ajoutez des produits à l'analyse depuis la section "Observation"
                  </p>
                </div>
              </td>
            </TableRow>
          ) : (
            analysisProducts.map((item) => (
              <AnalysisProductRow
                key={item.id}
                item={item}
                handleRowClick={handleRowClick}
                toggleNoteExpansion={toggleNoteExpansion}
                expandedNoteId={expandedNoteId}
                refetchAnalysis={refetchAnalysis}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnalysisProductsTable;
