
import React from 'react';
import { TableHead } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface HeaderColumn {
  id: string;
  title: string;
  icon: LucideIcon | null;
}

interface AnalysisTableHeaderProps {
  columns: HeaderColumn[];
}

const AnalysisTableHeader: React.FC<AnalysisTableHeaderProps> = ({ columns }) => {
  return (
    <>
      {columns.map((column) => (
        <TableHead key={column.id} className={cn(
          "text-center bg-gradient-to-r from-[#161616] to-[#181818] text-xs font-medium tracking-wide",
          column.id === 'sku' && "text-left pl-4",
          column.id === 'actions' && "text-right"
        )}>
          <div className="flex items-center justify-center">
            {column.icon && <column.icon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />}
            {column.title}
          </div>
        </TableHead>
      ))}
    </>
  );
};

export default AnalysisTableHeader;
