
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteCellProps {
  note: string | null;
  toggleNoteExpansion: (e: React.MouseEvent) => void;
}

const NoteCell: React.FC<NoteCellProps> = ({ note, toggleNoteExpansion }) => {
  return (
    <TableCell className="text-center py-3">
      {note ? (
        <button
          onClick={toggleNoteExpansion}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          )}
          aria-label="Voir la note"
        >
          <FileText className="h-4 w-4" />
        </button>
      ) : (
        <span className="text-gray-500">—</span>
      )}
    </TableCell>
  );
};

export default NoteCell;
